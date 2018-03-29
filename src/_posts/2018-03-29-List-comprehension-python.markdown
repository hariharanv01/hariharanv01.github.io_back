---
title: List Comprehension in Python
description: List/For comprehension in Python
layout: post
type: post
tags: [list comprehension, For comprehension, python]
categories: [agnostic]
---


List Comprehension is a construct for creating a new list based on some existing list. It's used extensively for transforming or filtering a list into a new list. Even though it's usually called as list comprehension or for comprehension, it's applicable for other collection types such as Sets and Maps as well. It's also a more concise and elegant alternative to map and reduce functions.

Python, arguably, is the easiest of all the mainstream programming languages to learn. It's also one of the most concise one.

Python supports list comprehension for List, Set and dictionary(Map). The syntax for comprehension in python are

1) For list - `[(elem operation) for elem in src_collection if conditions]`

2) For set and dict - `{(elem operation) for elem in src_collection if conditions}`

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

