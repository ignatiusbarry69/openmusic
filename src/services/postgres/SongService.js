const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError.js");
const NotFoundError = require("../../exceptions/NotFoundError.js");

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16);

    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    let text = "SELECT id, title, performer FROM songs WHERE 1 = 1";
    const values = [];

    if (title) {
      text += " AND title ILIKE '%' || $1 || '%'";
      values.push(title);
    }

    if (performer) {
      text += " AND performer ILIKE '%' || $" + (values.length + 1) + " || '%'";
      values.push(performer);
    }

    const query = {
      text: text,
      values: values,
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    return result.rows[0];
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: `UPDATE songs 
      SET
      title = $1,
      year = $2,
      genre = $3,
      performer = $4,
      duration = $5,
      album_id = $6 
      WHERE id = $7
      RETURNING id`,
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Pembaharuan lagu gagal. Id tidak ditemukan.");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Penghapusan lagu gagal. Id tidak ditemukan.");
    }
  }
}

module.exports = SongService;
