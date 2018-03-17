---
published: true
title: List Comprehension in Python, Scala and Haskell
description: Cheat sheet for list Comprehension in Python, Scala and Haskell
layout: post
type: post
tags: [list comprehension, for comprehension, for yield, comprehension, scala, python, haskell]
categories: [agnostic]
---

List Comprehension is a construct for creating a new list based on some existing list. It's used extensively for transforming or filtering a list into a new list. Even though it's usually called as list comprehension or for comprehension, it's applicable for other collection types such as Sets and Maps as well. It's also a more concise and elegant alternative to map and reduce functions.

Let's now try to use list comprehension to do the following two operations in Python, Scala and Haskell.

1) Get the list of all multiples of 3 from the source integer list

2) Create a new list with each element twice the element in the source integer list


### List Comprehension in Python:

Python, arguably, is the easiest of all the mainstream programming languages to learn. It's also one of the most concise one.

Python supports list comprehension for List, Set and dictionary(Map). The syntax for comprehension in python are

1) For list - <b>[</b>(elem operation) <b>for</b> elem <b>in</b> src_collection<b> if </b> conditions <b>]</b>

2) For set and dict - <b>{</b>(elem operation) <b>for</b> elem <b>in</b> src_collection<b> if </b> conditions <b>}</b>

The <b>if</b> condition is optional.

```python

src = [1,2,3,4,5,6,7,8,9]

#list of multiples of 3
print [i for i in src if i % 3 == 0]

#transform to 2 * elem
print [2 * i for i in src]

```

Let's see some other examples

```python

src_set = {1,2,3,4,5,6,7,8}

#set of multiples of 3
print {i for i in src_set if i % 3 == 0}

#set of tuple of (i, 2*i)
print {(i, 2*i) for i in src_set}

#dictionary of i:2*i
print {i: 2*i for i in src_set}


src_map = {1: "One", 2: "Two", 3: "Three"}

#list of all the keys in the src_map
print [k for k in src_map]

#list of all the values in the src_map
print [src_map[k] for k in src_map]


#list of product of all the pair of elements one from each list if the product is even 
print [i*j for i in [6,7,8,9] for j in [1,2,3,4] if (i*j) % 2 == 0]


twoDimlist = [[1,2,3], [4,5,6], [7,8,9]]

#deep copy of the 2D list
print [l[:] for l in twoDimlist]

#deep copy of the 2D list with all the nested lists reversed
print [l[::-1] for l in twoDimlist]

def factorial(n):
	if n == 1: return 1
	return n * factorial(n-1)
    
#list of factorials of all elements    
print [factorial(i) for i in [1,2,3,4,5]]    


# returns a Generator
print (2*i for i in range(0, 100))

```

Python's list comprehension is much more powerful and you can do many others operations using it.




### List Comprehension in Scala:

In Scala, list comprehension is called as for comprehension since it's achieved using for loops with yield.

The syntax is <b>for(</b>elem <b>&lt;-</b> src <b>if (</b> conditions <b>)) yield</b> (elem operation).

In scala for comprehensions, the result is dependent on the src's type.


```scala

val list = List(1,2,3,4,5,6,7,8,9)

//list of all multiples of 3
println{
	for (i <- list if i % 3 == 0) yield i
}

//transform to 2 * elem
println{
	for (i <- list) yield 2*i
}

```

Lets' see some other examples 

```scala

//set of all multiples of 3
println{
	for (i <- Set(1,2,3,4,5,6) if i % 3 == 0) yield i
}

//set of tuples of (i, 2*i)
println{
	for (i <- Set(1,2,3,4,5,6)) yield (i, 2*i)
}

//map of (i -> 2*i)
println{
	(for (i <- Set(1,2,3,4,5,6)) yield (i -> 2*i)).toMap
}



//map of (key -> 2*value)
println{
	for ((k,v) <- Map(1->1, 2->2, 3->3)) yield (k -> 2*v)
}

//list of all keys of the map
println{
	for ((k,v) <- Map(1->1, 2->2, 3->3)) yield k
}

//list of all values of the map
println{
	for ((k,v) <- Map(1->1, 2->2, 3->3)) yield v
}


//list of product of all the pair of elements one from each list if the product is even 
println{
	for (
    	i <- List(6,7,8,9);
        j <- List(1,2,3,4)
        if ((i*j) % 2 == 0)
    ) yield i * j
}


//Vector of "$"*i
println{
	for (i <- 1 to 10) yield "$" * i
}

//Vector of "$"*i for even "i"
println{
	for (i <- 2 to 10 by 2) yield "$" * i
}

```



### List Comprehension in Haskell:

Haskell is probably the purest of all the mainstream functional programming languages. With this tag, also comes a lot of restrictions on impurity. Any impure task need to be done in an IO Action Monad, and is  completely isolated from the pure functions.

List comprehension in Haskell has the following syntax

<b>[</b>(elem operation) <b>|</b> elem <b><- </b> src <b> , </b> conditions <b>]</b>

```haskell

--list of all multiples of 3
print [i | i <- [1..10], i `mod` 3 == 0]

--transform to 2 * elem
print [2*i | i <- [1..10]]

```

Let's see some other examples

```haskell

--list of tuple of (i, 2*i)
print [(i, 2*i) | i <- [1..10]]

--list of product of all the pair of elements one from each list if the product is even 
print [i*j | i <- [6,7,8,9], j <- [1,2,3,4], (i*j) `mod` 2 == 0 ]


--factorial function for positive integers
factorial :: Int -> Int
factorial 1 = 1
factorial n = n * factorial (n - 1)

--list of factorials of all elements
print [factorial i | i <- [1..10]]



--cool feature in Haskell through which we can do parallel list comprehension
--set the ParallelListComp Pragma if in GHCI mode
:set -XParallelListComp
--else
{-# LANGUAGE ParallelListComp #-}

--Parallel List comp. List of product of elements from first list with the element at the same index from the second list
[i * j | i <- [1..4] | j <- [6..9] ]

--zip the two lists
[(i, j) | i <- [1..3] | j <- ["One", "Two", "Three"] ]

```

Note that some of the Haskell comprehensions mentioned above may only work in GHC compiler. 


<br><br>

Hope you liked list comprehensions. Whatever mentioned above are just tip of the iceberg usage of list comprehensions. You can use it to do extremely complex transformations and filtering.
