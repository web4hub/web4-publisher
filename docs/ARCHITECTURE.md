```execute
web4-publisher/
├── README.md
├── LICENSE
├── package.json
├── package-lock.json
├── api.json
├── web4.config.json
├── schemas/
│   ├── repository.json
│   ├── manifest.json
│   └── publication.json
├── examples/
│   ├── github-codertocat.json
│   ├── web4-hello-world.json
│   └── web4-hello-world-npm.json
├── src/
│   ├── index.js
│   ├── github/
│   │   ├── client.js
│   │   ├── mapper.js
│   │   └── adapter.js
│   ├── core/
│   │   ├── normalize.js
│   │   ├── validate.js
│   │   ├── canonicalize.js
│   │   ├── hash.js
│   │   ├── identity.js
│   │   └── manifest.js
│   ├── publisher/
│   │   ├── publisher.js
│   │   ├── filesystem.js
│   │   └── index.js
│   └── server/
│       ├── server.js
│       └── routes.js
├── test/
│   ├── github.test.js
│   ├── normalize.test.js
│   ├── canonicalize.test.js
│   ├── hash.test.js
│   ├── manifest.test.js
│   └── integration.test.js
├── publications/
│   └── .gitkeep
└── docs/
    ├── ARCHITECTURE.md
    ├── DATA_MODEL.md
    ├── PROVENANCE.md
    ├── SECURITY.md
    └── API.md
