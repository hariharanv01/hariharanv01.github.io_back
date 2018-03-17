---
published: true
title: Python version of Groovy's @Memoized
description: A simple version of Groovy's @Memoized in Python
layout: post
type: post
tags: [python, decorator, memoize, groovy, functional programming]
categories: [python, decorator, memoize]
---
Functional Programming is fun to learn, a lot less error-prone(than imperative programming), easily testable and a lot briefer due to declarative style of programming.

One of the concept in functional programming is pure functions: A Pure function is a function that solely acts on its input for generating the output. It does not have any side effect: reading/writing into an external variable, printing to file/console, etc. As a result, pure functions are referentially transparent. ie. I can replace the function call with the actual result for the given set of input, since the output is always the same for a given input set.

Eg. Let's take the add function

```python
  def add(a, b): return a+b

  sum = add(10, 5) #add(10,5) can be replaced with 15 as add(..) is a pure function with no side effect. 
```

Another advantage of pure function is that it can be retried any number of times without any side effect.

Because of the concept of referential transparency, we can actually memoize(cache:verb) the output for the input sets for any pure function. The concept is beautifully used in Groovy's @Memoized annotation. Output of a function annotated with @memoize in groovy is memoized for the given input set. If the function is called again with the same input set, the result is returned directly from the memo(cache:noun) instead of actually computing it again. This makes sense for functions that are computationally intense, as we can speed up the execution.

Let's now try to recreate Groovy's @memoize annotation in Python using [decorators](http://www.learnpython.org/en/Decorators).

Let's first create a decorator name memoize. The memoize method takes two arguments the actual function(fn) that it will decorate and a dictionary(memo) for memoizing. Instead of a default method argument "memo", you can instead use an external variable(preferably an LRU cache to avoid running out of memory)


```python

  def memoize(fn , memo = {}):
    def inner(*args, **kwargs):
    	#Generate a unique key for function, function arguments combination. i.e. function invocation.
        key = fn.func_name + str(args)+str(kwargs)
        if key in memo:
            return memo[key]
        res = fn(*args, **kwargs)
        memo[key] = res
        return res
    return inner

```

What we are doing here is the memoize method will return an inner function that actually checks if the same function is called with the same arguments earlier. If it's, it will immediately return the result from the memo, else it will perform the actual computation by calling the function "fn" with the arguments passed to the "inner" function and store the result in the memo.

Now that @memoize is done, we can use it on any pure function.

```python

@memoize
def factorial(n):
	if n == 1: return 1
	return n * fact(n-1)

@memoize
def fibonacci(n):
	if n <= 0: return 0
	elif 0 < n < 3: return 1
	return fib(n-1) + fib(n-2)

```

As you can see, we can use the @memoize decorator for any number of pure functions. 

Also, you can note that the time complexity for first time computation of the fibonacci function is not exponential, but linear because of memoization(it's nothing but dynamic programming at a much higher level and also the function is very clear and concise without the need for all the dynamic programming boiler plate code). After the first computation for an input 
"n", the second function call with the same input "n" has constant time complexity (O(1)).

Note, that we should never use @memoize on impure functions, since the output of such functions can depend on external environments and not just the input arguments.


The same functionality is provided by functools.lru_cache decorator.


