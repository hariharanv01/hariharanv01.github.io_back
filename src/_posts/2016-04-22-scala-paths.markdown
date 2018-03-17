---
published: true
title: Scala Path dependent types and Path projections
description: Path dependent types and Path projection in Scala
layout: post
type: post
tags: [scala, path types, path dependent types, path projection]
categories: [scala]
---

Scala supports multiple Path types - path dependent types and path projections. To understand each, let's dig in with some examples


Let's assume we have Companies and Employees represented respectively by Company and Employee classes. We make the Employee class an inner class to the Company class, since employees are always associated with a Company.

```scala

class Company(name: String) {

    class Employee(id: Int, name: String)

    def work(emp: Employee) {
      //do some work
    }
    
}

```

There's also a work(..) method that takes an input of type Employee.

Now, let's try to create Companies and its employees.

```scala

val microsoft: Company = new Company("Microsoft")

val microsoftEmp = new microsoft.Employee(1, "James")

val google: Company = new Company("Google")

val googleEmp = new google.Employee(1, "John")

```

We have created two companies - Google and Microsoft; and two employees - one for Google and one for Microsoft.

Let's try to make the employees work for their respective companies.

```scala

microsoft.work(microsoftEmp)

google.work(googleEmp)

```

So far so good. Now, let's try to sabotage these companies by secretly making the employee of the other Company work for them.

```scala

microsoft.work(googleEmp) //Fails to compile

google.work(microsoftEmp) //Fails to compile

```

Wow, what happened there. The code fails to compile. People from Java background must be stunned. Since in Java the inner class objects are bound to their enclosing class types, so we can pass any inner class object to the Outer class' method that accept Inner class type as an argument.

However, Scala being a strongly typed language is different. In Scala, inner class objects are bound to its enclosing class' objects and not types. Hence, we cannot make Microsoft Employee to do Google's work. Pretty good. These are path-dependent types represented by the standard "."(dot) notion.

But, what if both the Companies come to an agreement that they will let eachother's employees work for them. Pretty simple. Scala provides a way to support this as well.

Modify the work(..) method to accept Inner objects tied to Outer class' types and not their instances. This is called Path projections represented by the #(hash) notion.

```scala

//Notice <Outer Type>#<Inner Type>.
def work(emp: Company#Employee) {
	//do some work
}

```

Now, we can make Google employee work for Microsoft and vice versa.

```scala

microsoft.work(googleEmp) //Complies successfully

google.work(microsoftEmp) //Complies successfully

```

Hurray. Scala strongly adheres to good practices, yet is flexible enough to make developer's life easy.



Note: 

In Scala, all paths are represented using "#"(hash) notion internally. So, when we say "def work(Employee)" it's internally represented as 
"def work(this.type#Employee)". "this.type" type of the object instance.
