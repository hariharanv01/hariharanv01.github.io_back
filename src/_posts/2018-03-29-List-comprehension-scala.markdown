---
title: List Comprehension in Scala
description: List/For comprehension in Scala
layout: post
type: post
tags: [list comprehension, For comprehension scala]
categories: [agnostic]
---


List Comprehension is a construct for creating a new list based on some existing list. It's used extensively for transforming or filtering a list into a new list. Even though it's usually called as list comprehension or for comprehension, it's applicable for other collection types such as Sets and Maps as well. It's also a more concise and elegant alternative to map and reduce functions.

In Scala, list comprehension is called as for comprehension since it's achieved using for loops with yield.

The syntax is `for(elem <- src if (conditions)) yield (elem operation)`.

In Scala for comprehensions, the result type is dependent on the src type.


```scala

val list = List(1,2,3,4,5,6,7,8,9)

//list of all multiples of 3: List(3, 6, 9)
println{
	for (i <- list if i % 3 == 0) yield i
}

//transform to 2 * elem: List(2, 4, 6, 8, 10, 12, 14, 16, 18)
println{
	for (i <- list) yield 2*i
}


//set of all multiples of 3: Set(6, 3)
println{
	for (i <- Set(1,2,3,4,5,6) if i % 3 == 0) yield i
}

//set of tuples of (i, 2*i): Set((5,10), (3,6), (4,8), (2,4), (6,12), (1,2))
println{
	for (i <- Set(1,2,3,4,5,6)) yield (i, 2*i)
}

//map of (i -> 2*i): Map(5 -> 10, 1 -> 2, 6 -> 12, 2 -> 4, 3 -> 6, 4 -> 8)
println{
	(for (i <- Set(1,2,3,4,5,6)) yield (i -> 2*i)).toMap
}


//map of (key -> 2*value): Map(1 -> 2, 2 -> 4, 3 -> 6)
println{
	for ((k,v) <- Map(1->1, 2->2, 3->3)) yield (k -> 2*v)
}

//list of all keys of the map: List(1, 2, 3)
println{
	for ((k,v) <- Map(1->1, 2->2, 3->3)) yield k
}

//list of all values of the map: List(One, Two, Three)
println{
  for ((k,v) <- Map(1->"One", 2->"Two", 3->"Three")) yield v
}


//list of product of all the pair of elements one from each list if the product is even: List(6, 12, 18, 24, 14, 28, 8, 16, 24, 32, 18, 36)
println{
	for (
    	i <- List(6,7,8,9);
        j <- List(1,2,3,4)
        if ((i*j) % 2 == 0)
    ) yield i * j
}


//Vector of "$"*i: Vector($, $$, $$$, $$$$, $$$$$, $$$$$$, $$$$$$$, $$$$$$$$, $$$$$$$$$, $$$$$$$$$$)
println{
	for (i <- 1 to 10) yield "$" * i
}

//Vector of "$"*i for even "i": Vector($$, $$$$, $$$$$$, $$$$$$$$, $$$$$$$$$$)
println{
	for (i <- 2 to 10 by 2) yield "$" * i
}

```
