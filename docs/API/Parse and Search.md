### Memoization
Use daily memoization for retrieving already processed queries, using Database ([[DB]])

### Site List
Adding site support should be easy.
 - Specifing search function
 - Specifing container selector
 - Specifing product parsing
Each website class will be a child of Website class.
### Concept
Make search queries for each specified website. 
Each added website will be processed with same query.
If query or results match, do memoization

### Website
##### Website Class
- abstract search method
- abstract products method (returns list of Product objects)
- no js / js only handler

##### Product Class
has to have required fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | string | Product name |
| link | string | Link to product shop |
| specs | [string] | List of product specifications |
| price | float | Product price |
| image_url | string | Product image |
| description | string | Product description | 
| shop_id | int | Shop id |


