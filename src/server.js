const dotenv = require("dotenv");
dotenv.config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");

const albums = require("./api/albums/index.js");
const songs = require("./api/songs/index.js");
const users = require("./api/users/index.js");
const authentications = require("./api/authentications/index.js");
const collaborations = require("./api/collaborations/index.js");
const playlists = require("./api/playlists/index.js");

const AlbumService = require("./services/postgres/AlbumService.js");
const AlbumValidator = require("./validator/albums/index.js");
const SongService = require("./services/postgres/SongService.js");
const SongValidator = require("./validator/songs/index.js");
const UsersService = require("./services/postgres/UsersService.js");
const UsersValidator = require("./validator/users/index.js");
const AuthenticationsValidator = require("./validator/authentications/index.js");
const AuthenticationsService = require("./services/postgres/AuthenticationsService.js");
const PlaylistsValidator = require("./validator/playlists/index.js");
const PlaylistsService = require("./services/postgres/PlaylistsService.js");
const CollaborationsValidator = require("./validator/collaborations/index.js");
const CollaborationsService = require("./services/postgres/CollaborationsService.js");

const TokenManager = require("./tokenize/TokenManager.js");

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        songService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
