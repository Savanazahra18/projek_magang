"""Quick API test suite to verify all endpoints work with the Flask test client."""
import json
from app import create_app

app = create_app()
client = app.test_client()

def test_health():
    res = client.get('/api/health')
    assert res.status_code == 200
    data = res.get_json()
    assert data['status'] == 'ok'
    print("[PASS] /api/health")

def test_auth():
    # 1. Invalid User / Wrong Password / Removed Email (must return 401)
    res_invalid = client.post('/api/auth/login', json={
        'email': 'unknown@relawannusantara.org',
        'password': 'wrongpassword'
    })
    assert res_invalid.status_code == 401

    res_removed = client.post('/api/auth/login', json={
        'email': 'admin@relawannusantara.org',
        'password': 'admin123'
    })
    assert res_removed.status_code == 401

    # 2. Program User
    res = client.post('/api/auth/login', json={
        'email': 'program@relawannusantara.org',
        'password': 'admin123'
    })
    assert res.status_code == 200
    data = res.get_json()
    assert 'token' in data
    assert data['user']['name'] == 'Cikipi'
    assert data['user']['role'] == 'Divisi Program'

    # 3. Finance User
    res_fin = client.post('/api/auth/login', json={
        'email': 'keuangan@relawannusantara.org',
        'password': 'admin123'
    })
    assert res_fin.status_code == 200
    data_fin = res_fin.get_json()
    assert data_fin['user']['role'] == 'Divisi Keuangan'
    assert data_fin['user']['name'] == 'Siti Rahma'

    # 4. Direktur User
    res_dir = client.post('/api/auth/login', json={
        'email': 'direktur@relawannusantara.org',
        'password': 'admin123'
    })
    assert res_dir.status_code == 200
    data_dir = res_dir.get_json()
    assert data_dir['user']['role'] == 'Direktur Utama'
    assert data_dir['user']['name'] == 'Aditya Pratama'
    print("[PASS] /api/auth/login (Program, Finance, & Direktur)")

def test_dashboard():
    res = client.get('/api/dashboard/summary')
    assert res.status_code == 200
    data = res.get_json()
    assert len(data['summaries']) == 8
    print("[PASS] /api/dashboard/summary")

def test_proposals():
    # 1. List
    res = client.get('/api/proposals')
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data['proposals'], list)
    assert data['counts']['total'] == len(data['proposals'])

    # 2. Create
    create_res = client.post('/api/proposals', json={
        'title': 'Pemberdayaan Nelayan Pesisir',
        'category': 'Ekonomi',
        'location': 'Pangandaran',
        'province': 'Jawa Barat'
    })
    assert create_res.status_code == 201
    new_p = create_res.get_json()['proposal']
    assert 'PR-2026' in new_p['id']

    # 3. Status update
    update_res = client.put(f"/api/proposals/{new_p['id']}/status", json={
        'status': 'Disetujui',
        'statusNote': 'Proposal disahkan oleh Direktur'
    })
    assert update_res.status_code == 200
    print("[PASS] /api/proposals (List, Create, Update status)")

def test_mous():
    # 1. List
    res = client.get('/api/mous')
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data['mous'], list)

    # 2. Create
    create_res = client.post('/api/mous', json={
        'title': 'Kemitraan Konservasi Mangrove',
        'partner': 'PT Pesisir Lestari',
        'category': 'Lingkungan',
        'location': 'Indramayu',
        'commitmentValue': 'Rp 200.000.000'
    })
    assert create_res.status_code == 201
    new_m = create_res.get_json()['mou']

    # 3. Status update
    update_res = client.put(f"/api/mous/{new_m['id']}/status", json={
        'status': 'Disetujui',
        'statusNote': 'MoU sah & ditandatangani kedua pihak'
    })
    assert update_res.status_code == 200
    print("[PASS] /api/mous (List, Create, Update status)")

def test_assessments():
    # 1. List
    res = client.get('/api/assessments')
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data['assessments'], list)

    # 2. Create UMKM assessment
    create_res = client.post('/api/assessments', json={
        'type': 'umkm',
        'title': 'Assessment Warung Sembako Berkah',
        'pmName': 'Ibu Nurhayati',
        'location': 'Bandung Barat',
        'province': 'Jawa Barat',
        'data': {
            'namaLengkap': 'Ibu Nurhayati',
            'nomorKtp': '3201002233445566',
            'pekerjaanUtama': 'Warung Kelontong',
            'pendapatanBulanan': '3000000',
            'bantuanDibutuhkan': ['Modal Usaha']
        }
    })
    assert create_res.status_code == 201
    new_asm = create_res.get_json()['assessment']
    assert new_asm['type'] == 'umkm'
    assert 'ASM-UMKM' in new_asm['id']

    # 3. Detail
    detail_res = client.get(f"/api/assessments/{new_asm['id']}")
    assert detail_res.status_code == 200
    detail_data = detail_res.get_json()['assessment']
    assert detail_data['data']['namaLengkap'] == 'Ibu Nurhayati'
    print("[PASS] /api/assessments (List, Create, Detail with JSON)")

def test_monev():
    # 1. List
    res = client.get('/api/monev')
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data['monevs'], list)

    # 2. Create
    create_res = client.post('/api/monev', json={
        'title': 'Monitoring Air Bersih Cisarua',
        'miproId': 'MIP-2026-024',
        'assessmentId': 'BD-2026-012',
        'requestId': 'REQ-2026-041',
        'location': 'Bogor',
        'officer': 'Ayu Larasati',
        'indicators': [
            {'component': 'Konstruksi reservoir', 'plan': '100%', 'actual': 80, 'note': 'Berjalan baik'}
        ]
    })
    assert create_res.status_code == 201
    new_mv = create_res.get_json()['monev']
    assert 'MON-2026' in new_mv['id']
    assert new_mv['progress'] == 80

    # 3. Update
    upd_res = client.put(f"/api/monev/{new_mv['id']}", json={
        'notes': 'Update catatan lapangan',
        'indicators': [
            {'component': 'Konstruksi reservoir', 'plan': '100%', 'actual': 95, 'note': 'Hampir selesai'}
        ]
    })
    assert upd_res.status_code == 200
    assert upd_res.get_json()['monev']['progress'] == 95

    # 4. Delete
    del_res = client.delete(f"/api/monev/{new_mv['id']}")
    assert del_res.status_code == 200
    print("[PASS] /api/monev (List, Create, Update, Delete)")

if __name__ == '__main__':
    print("Testing MADIPRO Flask Backend API...")
    test_health()
    test_auth()
    test_dashboard()
    test_proposals()
    test_mous()
    test_assessments()
    test_monev()
    print("\n[ALL TESTS PASSED SUCCESSFULLY!]")

