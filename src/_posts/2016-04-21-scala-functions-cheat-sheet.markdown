---
published: true
title: Scala Functions cheat sheet
description: Scala Functions cheat sheet
layout: post
type: post
tags: [scala, function, higher order, currying, lambda, partial function]
categories: [scala]
---

Scala is a powerful and extremely feature rich programming language, which is by heart a functional programming language. So, it's natural to expect a very rich and powerful function concepts.

Let's delve into some of the ways functions are used in scala.

1) Let's start with a very simple function that takes an Integer and a String and returns a String which is the repeatation of the input string the input integer times. Scala supports named arguments

```scala

def repeat(str: String, i: Int): String = str * i

//usages
println(repeat("$", 10))
println(repeat(i = 10, str = "$"))
println(repeat("$", i = 10))

```

2) Let's make the function better by introducing default values. Scala supports default value for function paramaters. So, if the argument which has a default value is not passed to the function the default value for that parameter is assumed.

```scala

//We have default value for 'i'
def repeat(str: String, i: Int = 10): String = str * i

//usages
println(repeat("$"))
println(repeat("$", 100))

```

3) Let's assume that we need to call the "repeat" function many times with the same String but with different integer values(similar to Locales with different message text). This is where [Currying](http://docs.scala-lang.org/tutorials/tour/currying.html) comes to picture. Currying(borrowed from Haskell) is a way in which a function is defined with multiple parameter list. The curried function can be called with one or more parameter list. If the function is called with all the parameter list, it executes the actual function body, else it returns another function that takes the missing parameter list as its argument.

```scala

def repeat(str: String)(i: Int = 10): String = str * i

//the underscore denotes the missing parameter lists
val curriedRepeat = repeat("$")_ //returns a function

//usages
println(repeat("$")(5))
println(curriedRepeat(100))


Other examples:
def translateTo(locale: Locale)(msg: String): String = Translator.translate(locale, msg)

val frenchTranslator = translateTo(Locale.FR)_
val germanTranslator = translateTo(Locale.DE)_

println(germanTranslator("How are you?"))
println(frenchTranslator("How are you?"))

```

4) Currying is cool. But it's not the only way to call functions partially. Partially applied functions are yet another way to call functions partially.

```scala

def repeat(str: String, i: Int = 10): String = str * i

//Note the _:Int. We need to mention the type for the compiler to correctly figure out the missing parameter.
val partialRepeat = repeat("$", _: Int) // Returns a function that takes an Int

//usages
println(partialRepeat(100))
println(repeat(_: String, _: Int)("$", 100))

```

5) Let's diverge from the repeating String and get into List processing. Given a list of Integers, we need to filter out all the Integers that are divisible by 2(even numbers).

```scala

def divisibleBy2(list: List[Int]):List[Int] = {
	//Refer to scala for-yield. This is similar to list comprehension in other languages
	for(elem <- list if (elem % 2 == 0)) yield elem
}

println(divisibleBy2(List(1,2,3,4,5,6,7)))

```

6) Done. Tomorrow if we need to add a similar function to check divisibilty by 3. We'll have to write another function - "divisibleBy3". This new function is very similar to function "divisibleBy2", except that instead of checking modulo 2 we need to check modulo 3. And if we need more divisibleBy functions we need to write one for each number. This will soon result in a lot of code repeatation. 
    
  Let's try to mend it and create a new function that can be reused by introducing a new paramter "n".
    
```scala

def divisibleByN(list: List[Int], n: Int):List[Int] = {
	for(elem <- list if (elem % n == 0)) yield elem
}

println(divisibleByN(List(1,2,3,4,5,6,7), 2))
println(divisibleByN(List(1,2,3,4,5,6,7), 3))
println(divisibleByN(List(1,2,3,4,5,6,7), 5))

```
    
  Now, we have made the function reusable and so we can use the same function to get elements divisible by 2 or 10 or 1000 or any positive integer.
    
  What if we need to get the list of all elements divisible by two numbers - say 2 and 3 or 3 and 5? We can modify divisibleByN(..) to accept two integers n1 and n2, and we check the modulo for both n1 and n2. 
    
7) What if we need to get the list of all elements divisible by one or more numbers? We can modify divisibleByN(..) to accept a variable number of integers(var-args).
    
```scala

//Note the * after Int
def divisibleByNums(list: List[Int], nums: Int*):List[Int] = {
	//ListBuffer is a mutable list
	val buffer = ListBuffer[Int]()
	for(elem <- list){
	  var div = true
	   for(num <- nums){
	     div = div && (elem % num == 0)
	   }
	  if (div) buffer += elem
	}
	buffer.toList
}

println(divisibleByNums((1 to 50).toList, 2,3,4))

```
	
8) Now, we can use this function to find divisibily by multiple numbers. But, what if we need all numbers that are divisible by 2 but not divisible by 3? We cannot use our divisibleByNums(..). However, we can modify it to work for this case also. 
    
  Introducing Higher Order Function - a function that accepts another function as an argument or returns a function or does both.
    
```scala

//func is any function that accepts an Int and returns a Boolean
def conditionalDivisibilty(list: List[Int], func: Int => Boolean):List[Int] = for (elem <- list if func(elem)) yield elem

def divisibleBy2And3ButNotBy5(i : Int): Boolean = (i % 2 == 0) && (i % 3 == 0) && (i % 5 != 0)

println(conditionalDivisibilty((1 to 50).toList, divisibleBy2And3ButNotBy5))

```	
 
  As you can see, we pass a function as a argument to our function, and we simply check if the passed function returns true for the current list element. If so, we add it to our result. Notice that the argument function implementation is completely given to the client who is calling our conditionalDivisibilty(..) function. This makes our function a lot briefer, a lot more extensible and a lot, lot more flexible.

9) But, we still have one problem. Do we have to write separate named functions ("divisibleBy2And3ButNotBy5") for different combinations. These functions will probably not be used anywhere else. Anonymous Functions for rescue.

  Anonymous functions(lambdas) are functions that do not have names. They are typically used in places where the function is not called from anywhere but is passed as an argument to another function.
    
  So, instead of creating a new named function, we pass a anonymous function as an argument.
    
```scala

println(conditionalDivisibilty((1 to 50).toList, (i: Int) => {(i % 2 == 0) && (i % 3 == 0) && (i % 5 != 0)}))

println(conditionalDivisibilty((1 to 50).toList, (i: Int) => {(i % 3 == 0) && (i % 5 == 0)}))

```

  This works for all our previous cases as well.


10) There may be cases where in we want to call a function only on a partial set of the input collection. For example, we want to create a new  list of positive integers() from the source list of integers by multiplying each element in the source list with 5.

One way to do this is using the 'map' method of the List type. However in this case we need to explicitly add a check to see if the current element is neither zero nor negative. You can instead use 'collect' method of List. The collect method accepts a PartialFunction as an argument.
    
  PartialFunction is a function that is called only on a partial set of the input collection.
    
```scala

val list = List(-3,-2,-1,0,1,2,3,4)

//Refer to pattern matching
println(list.collect{
    		case i if i > 0 => 2 * i
        })
                
```
    
  The collect(..) accepts a PartialFunction. The easy and brief way to create PartialFunctions are through pattern match cases.
    
  Note that a PartialFunction accepts only one Input and returns an Output.
    
    
11) We can assign function to variables
  
```scala

val incFunc = (i: Int) => if (i < Int.MaxValue) Some(i+1) else None

println(incFunc(Int.MaxValue))
println(incFunc(10))

```
    
    
12) We can define a function inside another function. The inner function can only be accessed from within its enclosing function. 
  This comes handly when we want to group statements based on functionality, but are not used outside a function. 
  
```scala

  \\A tail recursive version of factorial
  def fact(n: Int): Int = {
     	@scala.annotation.tailrec
      def fact(n: Int, i: Int): Int = {
  	if (n == 1) i
        else fact(n-1, i * n)
      }
      fact(n, 1)
}

```

13) Scala supports closure as well.

14) Scala also supports [Call-by name]({{site.url}}/posts/scala-call-by-name.html)

