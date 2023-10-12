# MongoDB

### Structure
- Hashed queries 
- Query alliases
- Products

### Hashed Queries
Each query will be found by a certain hash.
`hash -> { Query Result }`
##### Query Result
Each query will be stored for 24 hours from the moment of it being written
##### Fields
| Name | Type | Description |
| ---- | ---- | ----------- |
| Expire | int | Query expire timestamp |
| Products | [string] | List of all product hashes |
| Popularity | float | Query popularity rating |
| Hash | string | Products hashsum | 

### Query Alliases
`product hash -> [ Alliases (string) ]` 
Each query should have at least one allias, which relates to hash.
##### Fields
| Name | Type | Description |
| ---- | ---- | ----------- |
| Hash | string | Query hash |
| Alliases | list[string] | Query alliases |

### Products
`product hash -> { Product Data }`

Each product will have its own id. After every query old products are compared with new from the query. Product similarity is in its name and its shop id. If product hash is already in database, it is only updated. Each product has timespan of 7 days.

##### Product Fields
| Name | Type | Description |
| ---- | ---- | ----------- |
| name | string | Product name |
| link | string | Link to product shop |
| specs | [string] | List of product specifications |
| price | float | Product price |
| image_url | string | Product image |
| description | string | Product description | 
| shop_id | int | Shop id |
| hash | string | Product hash |
| id | int | Product id |

### Expire Bucket
Each db entry, which has expiration date will be stored here. Every n minutes, the lowest timestamp will be fetched and deleted, until all timestamps that are less than current time are deleted.