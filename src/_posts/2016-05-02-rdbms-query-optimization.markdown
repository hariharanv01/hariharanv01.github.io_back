---
published: true
title: RDBMS Query optimization
description: Optimizing queries on Relational databases like MySQL, PostgreSQL, Oracle, etc
layout: post
type: post
tags: [RDBMS optimization, query optimization, mysql, postresql]
categories: [db]
---

How many of you work with Relational Databases like MySQL, PostgreSQL, etc? I guess pretty much most. We all know that RDBMS - in general - is not as scalable as some of the NoSQL datastores out there, but what about performance? Are RDBMS queries slower than NoSQL's(Not referring to in-memory Caches like Redis, Aerospike, etc)? Not atleast as long as the queries are efficient.

Let's see how to efficiently query RDBMS. The points mentioned are mostly common to all Relational Databases.


### Index and more indexes, but not too much

We all know that queries involving non-indexed columns are very inefficient. Most of the time they require full table scan. To get rid of that we add indexes on our tables.

There are primarily two types of index - Clustered and Non-clustered. 

* Clustered indexes are indexes whose leaf nodes contain the data pages itself. The table data is sorted on the basis of the clustering key(by default primary key). There can be only one Clustered index per table as we cannot have the table data stored in multiple sort order. Clustered Index is very fast for retrieval since it itself has the data.

* Non Clustered Index, on the other hand, has leaf nodes that have either pointers to data pages if the table does not have a clustered index or the Clustered index key if the table has Clustered index. Lookups in a non-clustered index are not as efficient as in a clustered index since it first needs to retrieve all the clustered index keys from the non clustered index and then lookup in the Clustered index to get the actual data.

Let's gist some points to make querying efficient using indexes

1) To make queries efficient, we must create indexes on all columns that are often queried. 

2) We need to be extra careful while creating composite indexes(index on multiple columns). A Composite index on columns (col1, col2, col3) will be used only if the query has value for atleast col1. If the query has only value(s) for col2 or/and col3, the composite index cannot be used. So, design your composite index with the most available(in the query) column in the left and proceed towards the right with the lesser available columns.

3) Lookups in clustered index are faster than in non clustered index as mentioned above. So, if you have an option make sure that you query using clustering key.

4) Too much of indexes are also bad. Indexes need to be in-memory for the queries to be efficient. Too much of Indexes mean more memory required and hence may involve a lot of page faults. So, create indexes only on column(s) that will be queried more often.

5) Do not create duplicate indexes. It not just wastes memory, but is also inefficient in some Relational databases. 


### Get only what you need


We often have the tendency to use "\*" in our queries. "\*" or get all columns' values may be simple to write instead of specifying only the columns we need, but has its own contribution to the overall latency overhead.

```sql

SELECT * FROM employee where age < 30;

-- is less efficient than

SELECT id, name, department FROM employee where age < 30;

-- is less efficient than

SELECT id FROM employee where age < 30; -- assuming id is the clustering key

```

There are multiple reasons why proper projections must be used. When we say "\*" we are retrieving all columns' values which will increase the amount of data that need to be transmitted over the wire increasing the network latency. This makes a lot of sense especially when you have joins in your query. "\*" will also add CPU and memory overhead for the server.

Also, limiting the projections to only the columns we need will improve the performance on the DB side as well if the column(s) we asked for is/are part of the clustering key(s).


### "Where" are we going?

Selections(where clauses) are often more important than projections. They are the ones that tell that DB Query engine to use which index(es). Ensuring that we properly use where clause is of utmost importance in query optimization. 

One of the main reason for a query being very slow is because the DB need to sift over a large number of rows. This is especially true if our where clause is inefficient. We need to make sure that the where clause filters out everything that we don't need. 

Another common mistake we make is fetching more rows than what we need. For example we might need only the top 10 scorers in an examination. However we have a query that sorts that results on the basis of the score and fetch all the rows. We think that we can read the first 10 records from the result set and then close it assuming that the DB will provide us with the top 10 score rows and then stop executing the query. This, however, is not true with most of the DBs. The DB returns all the rows and the DB client running in the application is the one that gets only the top 10 results and discards others. In this case it's prudent to use "LIMIT" or "ROWNUM" to limit the number of records returned from the DB.

To check if the DB examines more records than you intend it to, you can use "EXPLAIN" on the queries.

### Don't complicate your query

Often we have to write complex queries involving multiple joins. This not just makes the code less maintainable and scary, but increases the load on the DB server to parse and optimize the complex query. We can decompose such queries to multiple simpler queries and then doing the join in the application. This will involve more network calls as we need to execute many simpler queries instead of 1 complex query, but network IOs are extremely fast these days(faster than disk IO). Also, this approach can reduce lock contentions. Doing joins in the application will also make the DB much more scalable as we can partition the DB by placing tables on different servers.

### Use DB query-cache friendly queries

Some DBs like MySQL have query caches. Queries are checked in the cache even before they are parsed. If the cache has that exact query(case sensitive in MySQL), it simply returns records from the cache. It skips every other stage in query execution. However, the query cache lookup operation is a case sensitive hash lookup. So, if your query differs from a similar query in the cache by even a single character, it won't match. 

This might sound trivial, but if you use the same query in multiple places make sure that they are all exactly same - even character case wise and position of the projections, selections, etc. You can have a common constant query string that's used across your application.

### Use joins instead of subqueries

This section may be specific to certain DBs. Older versions of MySQL is very inefficient in dealing with most subqueries. The query optimizer in the DB will screw up a subquery in the name of optimization. Even though there are some subqueries that perform better than an equivalent join, use joins to be on the safe side. If you are adventurous you can examine both the queries - subquery and join - using "EXPLAIN" and then decide.

### Check your "Union"

There are some optimization that you can use on UNION queries. UNION( ALL) queries mostly work by creating a temporary table and doing the operations in the temporary table.

1. Prefer UNION ALL over UNION unless you need distinct rows and the number of rows that is returned is small.  UNION includes the distinct option to the temporary table and uses the full row to determine uniqueness.

2. Have "WHERE", "ORDER BY" and "LIMIT" clauses within each SELECT query in the UNION query. This will help tp reduce the number of rows in the temporary table.

```sql

SELECT id, name, age FROM employee 
UNION ALL
SELECT id, first_name, age FROM legacy_employee
LIMIT 100;

-- is less efficient than

SELECT id, name, age FROM employee LIMIT 100
UNION ALL
SELECT id, first_name, age FROM legacy_employee LIMIT 100
LIMIT 100;

```

### Few other optimization tips

1) Use COUNT(*) instead of COUNT(col) whenever you need to count the number of rows.

2) Have, as much as possible, only columns from the same table in the GROUP BY clause for queries involving joins.

3) Make sure your transactions are as small as possible.

4) Use the most appropriate Isolation level for the transactions.

5) Avoid joins and foreign key constraint as much as possible as this will severely impact DB scalability and hence performance(if too much of data is in one server).
