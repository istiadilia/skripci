// handlers/userHandler.js
const { v4: uuidv4 } = require('uuid');
const pool = require('../../db');

exports.registerUser = async (req, res) => { 
    const { nama, no_telp, password, provinsi, kota, kecamatan, alamat } = req.body;

    // pastikan tidak ada nilai kosong
    if (!nama || !no_telp || !password || !provinsi || !kota || !kecamatan || !alamat) {
        return res.status(400).json({
            status: 'fail',
            message: 'Semua field harus diisi',
        });
    }

    try {
        // Periksa apakah nomor telepon sudah digunakan
        const checkQuery = {
            text: 'SELECT * FROM "User" WHERE no_telp = $1',
            values: [no_telp],
        };

        const checkResult = await pool.query(checkQuery);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Nomor telepon sudah digunakan',
            });
        }

        // Use uuid to generate a unique ID
        const user_id = uuidv4();

        const query = {
            text: 'INSERT INTO "User" (user_id, nama, no_telp, password, provinsi, kota, kecamatan, alamat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            values: [user_id, nama, no_telp, password, provinsi, kota, kecamatan, alamat],
        };

        await pool.query(query);

        return res.status(201).json({
            status: 'success',
            message: 'User berhasil ditambahkan',
            data: {
                userId: user_id,
                nama: nama,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'fail',
            message: 'Gagal menambahkan user',
        });
    }
};

exports.loginUser = async (req, res) => {
    const { no_telp, password } = req.body;

    try {
        const query = {
            text: 'SELECT user_id, nama, no_telp, password, provinsi, kota, kecamatan, alamat FROM "User" WHERE no_telp = $1',
            values: [no_telp],
        };

        const result = await pool.query(query);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            if (user.password === password) {
                return res.status(200).json({
                    status: 'success',
                    message: 'Login berhasil',
                    data: {
                        userId: user.user_id,
                        nama: user.nama,
                        noTelp: user.no_telp,
                        provinsi: user.provinsi,
                        kota: user.kota,
                        kecamatan: user.kecamatan,
                        alamat: user.alamat
                    },
                });
            } else {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Kata sandi salah',
                });
            }
        } else {
            return res.status(400).json({
                status: 'fail',
                message: 'Nomor telepon tidak ditemukan',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'fail',
            message: 'Terjadi kesalahan pada server',
        });
    }
};