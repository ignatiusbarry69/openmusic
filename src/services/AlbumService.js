const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }
  async addAlbum({ name, year }) {
    const id = nanoid(16);
    const query = {
      text: "INSERT INTO albums VALUES($1,$2,$3) RETURNING id",
      values: [id, name, year],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Catatan gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const queryForSongs = {
      text: "SELECT * FROM songs WHERE album_id = $1",
      values: [id],
    };
    const songs = await this._pool.query(queryForSongs);

    const queryForAlbum = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    };
    const albums = await this._pool.query(queryForAlbum);
    if (!albums.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const album = albums.rows[0];
    const result = {
      id: album.name,
      name: album.name,
      year: album.year,
      songList: songs.rows, //try this
    };
    return result;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      values: [name, year, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui album");
    }
  }
  async deleteNoteById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }
}
module.exports = AlbumService;
