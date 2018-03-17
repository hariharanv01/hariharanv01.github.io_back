---
published: true
title: Scala call-by name
description: Create your own custom control blocks, conditional blocks, etc, and extend the language by using Scala's call by name capabilities
layout: post
type: post
tags: [scala, call-by-name, call by name, block]
categories: [scala, call-by-name]
---

In many languages, you are used to call-by value. ie. the argument's value is evaluated before the function/method is invoked.

```scala

def getResult(resultAfterHeavyComputation: String, compute: Boolean): Option[String] = if (compute) resultAfterHeavyComputation else None    

def heavyComputation(): String = {
	//some very intense computation
}

println(getResult(heavyComputation(), false))

```

From the above code snippet, we can see that every time when getResult(..) is invoked, the first argument to the method is computed irrespective of the value of the second argument 'compute'. However, if you notice carefully you can see that the heavyComputation() method needs to be called only when the parameter 'compute' is true. If 'compute' is false, we are simply wasting CPU cycles executing heavyComputation(). This also increases the overall execution time.


How can we fix this?

One way is to modify the function getResult(..) to accept a function(say fn: () => String) that returns a String as the first parameter instead of a String. We call the function 'fn' only when 'compute' is true. This way we can avoid heavyComputation() when 'compute' is false. 

```scala

def getResult(heavyComputationFunc: () => String, compute: Boolean): Option[String] = if (compute) heavyComputationFunc() else None    

def heavyComputation(): String = {
	//some very intense computation
}

//heavyComputation function itself is passed as the argument
println(getResult(heavyComputation, false))

```

But, the problem with this approach is that we always need to pass a function as the first argument. We cannot pass a String directly as the first argument even if we want to.


Here comes Scala's call-by name. Scala provides a way to pass argument by name instead of value. That's is we can pass a block of code as a function argument. The block could be either a single expression or a set of statements. The block is evaluated only when it's called from inside the enclosing function and not during function invocation.


```scala

//call by name.Notice the syntax ": =>". A space is needed between : and =>
def getResult(heavyComputationBlock: => String, compute: Boolean): Option[String] = if (compute) heavyComputationBlock else None    


//The first argument block is not computed here.
println(getResult({
	//some very intense computations that finally return a String
}, false))

```


Hmm.. Guess you are not too excited. Let's get to the beauty of call-by name. 

Assume we would like to implement "until" loop. "until" is exact opposite of "while" loop. That is, keep on executing the block until some condition becomes true.

Let's create the until block.

```scala

package com.h2v.controlblocks

object CondtrolBlocks {
	
    //Refer to Scala currying for methods with more than one param set
    def until(condition: => Boolean)(body: => Unit) {
    	if (!condition) {
            body
            until(condition)(body)
        }
    }
    
}


package com.h2v.test

object Test {
	
    import com.h2v.controlblocks.ControlBlocks._
    
    var count: Int = 5
    
    until(count <= 0) {
    	println(count)
        count -= 1
    }
    
}

```

The until method takes two parameters

1) condition - The condition to evaluate 

2) body - The block to execute if the condition is false


Notice that both the arguments are passed-by name. That is they are evaluated only when called inside the function to which they are passed as arguments. This is required since if we pass these arguments by value, they are evaluated before the until method is called and the evaluated value is passed to the until method. We need to evaluate 'condition' and  'body' everytime when it's invoked with the latest state of both the arguments. So, whenever we call 'condition' block, it's latest value is interpreted. 

