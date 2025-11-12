# Export API Documentation

API endpoint for exporting game statistics data in various formats.

## Endpoint

```
GET /api/export
```

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Conditional | Game slug (required when type=single) |
| `format` | string | No | Export format: `csv`, `metadata-csv`, `tables-csv` (default: `csv`) |
| `type` | string | No | Export type: `single`, `all`, `season` (default: `single`) |
| `season` | number | Conditional | Season year (required when type=season) |

## Export Formats

### `csv` (default)
Full game export including metadata and all statistics tables.

### `metadata-csv`
Game metadata only (frontmatter fields like date, opponent, scores, etc.)

### `tables-csv`
Statistics tables only (extracted from markdown content)

## Export Types

### `single` (default)
Export a single game by slug.

**Required Parameters:** `slug`

**Example:**
```
GET /api/export?slug=2024-09-07-appalachian-state&format=csv
```

### `all`
Export all games' metadata.

**Example:**
```
GET /api/export?type=all&format=metadata-csv
```

### `season`
Export all games from a specific season.

**Required Parameters:** `season`

**Example:**
```
GET /api/export?type=season&season=2024&format=csv
```

## Response

### Success (200 OK)
Returns CSV file with appropriate headers:
- `Content-Type: text/csv;charset=utf-8`
- `Content-Disposition: attachment; filename="..."`
- UTF-8 BOM included for Excel compatibility

### Error Responses

#### 400 Bad Request
Invalid parameters or missing required fields.

```json
{
  "error": "Missing required parameter: slug"
}
```

#### 404 Not Found
Game or data not found.

```json
{
  "error": "Game not found: invalid-slug"
}
```

#### 500 Internal Server Error
Server error during export.

```json
{
  "error": "Failed to export data",
  "message": "Error details"
}
```

## Examples

### Export Single Game (Full)
```
GET /api/export?slug=2024-09-07-appalachian-state
```

Downloads: `2024-09-07-appalachian-state.csv`

### Export Game Metadata Only
```
GET /api/export?slug=2024-09-07-appalachian-state&format=metadata-csv
```

Downloads: `2024-09-07-appalachian-state-metadata.csv`

### Export Game Tables Only
```
GET /api/export?slug=2024-09-07-appalachian-state&format=tables-csv
```

Downloads: `2024-09-07-appalachian-state-tables.csv`

### Export All Games
```
GET /api/export?type=all
```

Downloads: `all-games.csv`

### Export 2024 Season
```
GET /api/export?type=season&season=2024
```

Downloads: `2024-season.csv`

## Implementation Details

- Uses `@/lib/export/csv` utilities for CSV generation
- Fetches game data using `@/lib/markdown/getGameBySlug` and `@/lib/markdown/getAllGames`
- Validates all input parameters
- Handles errors gracefully with appropriate HTTP status codes
- Includes UTF-8 BOM for Excel compatibility

## Testing

The underlying CSV export utilities (`lib/export/csv.ts`) have comprehensive test coverage with 39 test cases. The API route can be tested manually or via integration tests.

### Manual Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test the endpoint:
   ```bash
   # Single game export
   curl "http://localhost:3000/api/export?slug=2024-09-07-appalachian-state" -o game.csv

   # All games export
   curl "http://localhost:3000/api/export?type=all" -o all-games.csv

   # Season export
   curl "http://localhost:3000/api/export?type=season&season=2024" -o 2024-season.csv
   ```

3. Verify the downloaded CSV files open correctly in:
   - Excel
   - Google Sheets
   - Text editors

## Notes

- CSV files include UTF-8 BOM (`\uFEFF`) for Excel compatibility
- All special characters are properly escaped
- Nested data structures are flattened with dot notation
- Missing optional fields are handled gracefully
