const { v4: uuidv4 } = require('uuid');
const pool = require('../../db'); // Import pool dari db.js

// fungsi handler untuk menambahkan post
exports.addNewPost = async (req, res) => {
    const { jenisTernak, jenisAksi, keterangan, latitude, longitude, user_id } = req.body;

    const postId = uuidv4();
    const publishedAt = new Date().toISOString();
    const updatedAt = publishedAt;
    const petugas = 'default';
    const status = 'Menunggu';

    if (!jenisTernak) {
        return res.status(400).json({
            status: 'fail',
            message: 'Mohon isi jenis ternak',
        });
    }
    if (!jenisAksi) {
        return res.status(400).json({
            status: 'fail',
            message: 'Mohon isi jenis aksi',
        });
    }
    if (!latitude || !longitude) {
        return res.status(400).json({
            status: 'fail',
            message: 'Lokasi tidak ditemukan',
        });
    }
    if (!user_id){
        return res.status(400).json({
            status: 'fail',
            message: 'Pengguna tidak ditemukan'
        });
    }

    //console.log(postId, jenisTernak, jenisAksi, keterangan, latitude, longitude, publishedAt, updatedAt, petugas, status)
    try {
        const query = {
            text: 'INSERT INTO "Post" (user_id, post_id, jenis_ternak, jenis_aksi, keterangan, latitude, longitude, created_at, updated_at, petugas, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING post_id',
            values: [user_id, postId, jenisTernak, jenisAksi, keterangan, latitude, longitude, publishedAt, updatedAt, petugas, status],
        };
        const result = await pool.query(query);

        return res.status(201).json({
            status: 'success',
            message: 'Post berhasil ditambahkan',
            data: {
                postId: result.rows[0].post_id,
            },
        });
    } catch (error) {
        console.error('Error executing query', error);
        return res.status(500).json({
            status: 'fail', 
            message: 'Gagal menambahkan post',
        });
    }
};

// dapatkan semua post
exports.getAllPost = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Post"');
        return res.json({
            status: 'success',
            data: {
                // ambil semua atribut dalam baris
                posts: result.rows,
            },
        });
    } catch (error) {
        console.error('Error executing query', error);
        return res.status(500).json({
            status: 'fail',
            message: 'Gagal mengambil post',
        });
    }
};

// dapatkan post spesifik berdasarkan id
exports.getPostById = async (req, res) => {
    const { postId } = req.params;

    try {
        const query = {
            text: 'SELECT * FROM "Post" WHERE post_id = $1',
            values: [postId],
        };

        const result = await pool.query(query);

        if (result.rows.length > 0) {
            return res.json({
                status: 'success',
                data: {
                    // ambil semua atribut dalam baris pada tabel post dengan id tertentu
                    post: result.rows[0],
                },
            });
        } else {
            return res.status(404).json({
                status: 'fail',
                message: 'Post tidak ditemukan',
            });
        }
    } catch (error) {
        console.error('Error executing query', error);
        return res.status(500).json({
            status: 'fail',
            message: 'Gagal mengambil post',
        });
    }
};

// perbarui post berdasarkan id
exports.updatePostById = async (req, res) => {
    const { postId } = req.params;
    const { jenisTernak, jenisAksi, keterangan } = req.body;
    const updatedAt = new Date().toISOString();

    try {
        const query = {
            text: 'UPDATE "Post" SET jenis_ternak = $1, jenis_aksi = $2, keterangan = $3, updated_at = $4 WHERE post_id = $5 RETURNING post_id',
            values: [jenisTernak, jenisAksi, keterangan, updatedAt, postId],
        };

        const result = await pool.query(query);

        if (result.rowCount > 0) {
            return res.status(200).json({
                status: 'success',
                message: 'Post berhasil diperbarui',
            });
        } else {
            return res.status(404).json({
                status: 'fail',
                message: 'Gagal memperbarui post. Id tidak ditemukan',
            });
        }
    } catch (error) {
        console.error('Error executing query', error);
        return res.status(500).json({
            status: 'fail',
            message: 'Gagal memperbarui post',
        });
    }
};


// hapus post berdasarkan id
exports.deletePostById = async (req, res) => {
    const { postId } = req.params;

    try {
        const query = {
            text: 'DELETE FROM "Post" WHERE post_id = $1 RETURNING post_id',
            values: [postId],
        };

        const result = await pool.query(query);

        if (result.rowCount > 0) {
            return res.status(200).json({
                status: 'success',
                message: 'Post berhasil dihapus',
            });
        } else {
            return res.status(404).json({
                status: 'fail',
                message: 'Post gagal dihapus. Id tidak ditemukan',
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Gagal menghapus post',
        });
    }
};