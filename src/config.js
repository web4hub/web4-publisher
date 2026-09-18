{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://web4hub.org/schemas/web4.config.schema.json",
  "title": "Web4 Publisher Configuration",
  "type": "object",
  "additionalProperties": false,
  "required": ["version", "site", "content", "build", "themes"],
  "properties": {
    "$schema": {
      "type": "string"
    },
    "version": {
      "type": "integer",
      "const": 1
    },
    "site": {
      "type": "object",
      "additionalProperties": false,
      "required": ["name", "description"],
      "properties": {
        "name": {
          "type": "string",
          "minLength": 1
        },
        "description": {
          "type": "string"
        },
        "url": {
          "type": "string",
          "format": "uri"
        },
        "language": {
          "type": "string",
          "minLength": 2
        },
        "basePath": {
          "type": "string"
        }
      }
    },
    "content": {
      "type": "object",
      "additionalProperties": false,
      "required": ["directory", "extensions", "schema"],
      "properties": {
        "directory": {
          "type": "string",
          "minLength": 1
        },
        "extensions": {
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^\\.[a-z0-9]+$"
          },
          "minItems": 1
        },
        "schema": {
          "type": "string"
        },
        "includeDrafts": {
          "type": "boolean"
        },
        "sortBy": {
          "type": "string",
          "enum": ["date", "title"]
        },
        "sortOrder": {
          "type": "string",
          "enum": ["ascending", "descending"]
        }
      }
    },
    "build": {
      "type": "object",
      "additionalProperties": false,
      "required": ["outputDirectory"],
      "properties": {
        "outputDirectory": {
          "type": "string",
          "minLength": 1
        },
        "clean": {
          "type": "boolean"
        },
        "generateIndex": {
          "type": "boolean"
        },
        "minify": {
          "type": "boolean"
        }
      }
    },
    "themes": {
      "type": "object",
      "additionalProperties": false,
      "required": ["default", "available"],
      "properties": {
        "default": {
          "type": "string"
        },
        "available": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "minItems": 1
        }
      }
    }
  }
}
