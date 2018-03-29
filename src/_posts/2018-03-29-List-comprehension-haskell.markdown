---
title: List Comprehension in Haskell
description: List/For comprehension in Haskell
layout: post
type: post
tags: [list comprehension, For comprehension, haskell]
categories: [agnostic]
---


List Comprehension is a construct for creating a new list based on some existing list. It's used extensively for transforming or filtering a list into a new list. Even though it's usually called as list comprehension or for comprehension, it's applicable for other collection types such as Sets and Maps as well. It's also a more concise and elegant alternative to map and reduce functions.

Haskell is probably the purest of all the mainstream functional programming languages. With this tag, also comes a lot of restrictions on impurity. Any impure task need to be done in an IO Action Monad, and is  completely isolated from the pure functions.

List comprehension in Haskell has the following syntax

`[(elem operation) | elem <- src, conditions]`


```haskell

--list of all multiples of 3
print [i | i <- [1..10], i `mod` 3 == 0]

--transform to 2 * elem
print [2*i | i <- [1..10]]

```

Let's see some other examples

```haskell

--list of tuple of (i, 2*i): [(1,2),(2,4),(3,6),(4,8),(5,10),(6,12),(7,14),(8,16),(9,18),(10,20)]
print [(i, 2*i) | i <- [1..10]]

--list of even product of all the pair of elements one from each list: [6,12,18,24,14,28,8,16,24,32,18,36] 
print [i*j | i <- [6,7,8,9], j <- [1,2,3,4], (i*j) `mod` 2 == 0 ]


--factorial function for positive integers: 
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

--Parallel List comp. List of product of elements from first list with the element at the same index from the second list: [6,14,24,36]
[i * j | i <- [1..4] | j <- [6..9] ]

--zip the two lists: [(1,"One"),(2,"Two"),(3,"Three")]
[(i, j) | i <- [1..3] | j <- ["One", "Two", "Three"] ]

```

Note that some of the Haskell comprehensions mentioned above may only work in GHC compiler. 