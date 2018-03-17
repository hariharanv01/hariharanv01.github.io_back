---
published: true
title: Scala Implicit Class
description: Extend classes in Scala using Implicit classes. Add your own behaviors to already defined classes - even the sealed ones
layout: post
type: post
tags: [scala, implicits, implicit class]
categories: [scala, implicits]
---

Ever wondered what will it be if you get the power to extend a non-extensible(final in Java, sealed in Scala) class like String, Wrapper Classes and others. Awesome, right.

The classes which were deemed to be untouchable for extension are now open for extension albeit being indirectly. You still can't inherit a final class(sealed class outside the source file), but Scala provides a cool alternative to it thought Implicit conversion.

As the name suggests Scala provides a way to make some conversions implicitly available provided the Implicit definitions are in scope. Let's not get too theoretical, let's dive in with some examples.


I have always wanted some extra behaviour to the Int class in Scala. 

For example approximately equal to (~=) method. This method gets three params - two Ints and a delta value, and checks if the absolute difference between the two Ints are less than or equal to the delta. If so, returns true else returns false.

One way to implement this is by providing a Object(singleton) class and defining a Utility method.

```scala
   object IntUtil {
      
    def approxEq(i: Int, j: Int, delta: Int): Boolean = (i - j).abs <= delta
   
   } 
```

While this works, it's really not good looking when it's used:

```scala
   if (IntUtil.approxEq(10, 5, 2)) doSomething
```

One improvement we can make over this is by replacing the method name 'approxEq' to '~=' since Scala supports operator overloading; and by using imports. So, now the usage becomes

```scala
import IntUtil._
if (~=(10, 5, 2)) doSomething
```

This is better than the previous one, but still not so pleasing to the eyes. What if I have the ability to invoke the ~= method on Int object itself.

Hurray, there's a way to do this in Scala using Implicit class.

Lets' first define an Implicit class. Implicit class' primary constructor takes only one argument - the object which needs to be extended(in the programmer's view). Also, Implicit classes cannot be defined at the top level, it needs to be inside a class or object or trait(similar to Mixins in Ruby and vaguely to Interfaces in Java)

```scala
   object Implicits { 
   
    implicit class IntUtil( i: Int ) {
      
      def ~=(j : Int, delta: Int = 1): Boolean = (i - j).abs <= delta
   
    }
      
   }
```

Here, I have a default value for 'delta', so while invoking this method if no second argument is passed, the delta will assume it's default value.

Now, lets see how it's used. 

```scala
   // We need to first import the context in which the implicit class is defined.
   import Implicits._
   
   println ( 5 ~= 6 ) 
   println ( 5 ~= (8, 2) )
   println ( 5 ~= (9, delta = 3) )
```

That's it. You can add any number of functions/methods to the Implicit class. Lets say ! (factorial), isPrime, gcd, lcm, etc.

Not just Int, you can use your imagination to add functionalities to String, List, Employee, Car, etc, anything.


There are some restrictions available for Implicit classes as of Scala 2.11.x,

1)  Implicit classes must be inside a class or object or trait

2) Implicit class' primary constructor can have only one argument

3) There must not be any variable/method/member/object with the same name as the Implicit class in the scope.

