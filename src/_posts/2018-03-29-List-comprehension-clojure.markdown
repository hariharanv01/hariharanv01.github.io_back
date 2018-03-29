---
title: List Comprehension in Clojure
description: List comprehension in Clojure
layout: post
type: post
tags: [list comprehension, clojure]
categories: [agnostic]
---

List Comprehension is a construct for creating a new sequence based on some existing sequence. It's used extensively for transforming or filtering a sequence into a new sequence. Even though it's usually called as list comprehension or for comprehension, it's applicable for other collection types such as Sets and Maps as well. It's also an alternative to map and reduce functions. 

We use `for` comprehension (using a `for` clause) to achieve list comprehension in Clojure.

```clojure

;; list of twice of each element in the original list
(for [i [1 2 3 4 5]] (* 2 i)) ;; yields (2 4 6 8 10)

;; list of twice of each element in the original list
(for [i (range 1 6)] (* 2 i)) ;; yields (2 4 6 8 10)

;; list of even elements in the original list
(for [i (range 1 11) :when (even? i)] i) ;; yields (2 4 6 8 10)
(for [i (range 1 11) :when (= 0 (mod i 2))] i) ;; yields (2 4 6 8 10)

;; Set of twice of each element in the original list
(into #{} (for [i (range 5)] (* 2 i))) ;; yields #{0 4 6 2 8}
(set (for [i (range 5)] (* 2 i)))  ;; yields #{0 4 6 2 8}

;; Create a Map (dict) with key as the elements in the list, and value as double the key
(into {} (for [i (range 5)] [i (* 2 i)])) ;; yield {0 0, 1 2, 2 4, 3 6, 4 8}

;; Get a list of keys from the map
(for [[k v] {:1 1 :2 2 :3 3}] k) ;; yields (:1 :2 :3). alternative to (keys {:1 1 :2 2 :3 3})

;; Get a list of values from the map
(for [[k v] {:1 1 :2 2 :3 3}] v) ;; yields (1 2 3). alternative to (vals {:1 1 :2 2 :3 3})

;; Get a list of product of each element from the first list with each element from the second list
(for [i (range 1 5)
      j (range 6 11)]
      (* i j))          ;; yields (6 7 8 9 10 12 14 16 18 20 18 21 24 27 30 24 28 32 36 40)


```



