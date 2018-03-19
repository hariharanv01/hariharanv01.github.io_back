---
published: true
title: Memory Mapped IO debunked
description: What is Memory Mapped IO and when and when not to use it
layout: post
type: post
tags: [memory mapped io, mapped io, java, io]
categories: [agnostic, io]
---

This post explains about File IO in general and then about Memory mapped IO. Eventhough we use Java for explaining concepts through its Types, it's however generic to most programming languages.

### How File IO works

Whenever an user application(like a java process) wants to read a file/write into a file, it will have to delegate the task to the OS as the application itself is not previleged to directly read/write from the file. This is the case with almost all of the popular OS.

Let's run a Java process that wants to read a file. To do this we will need to use of one of the appropriate Readers/Streams to read from a file. Let's use <b>FileInputStream</b>.

```java 

InputStream fs = new FileInputStream(file);
int data;
while ((data = fs.read()) != -1) {
	System.out.print(data);
}

```

Internally whenever the read(..) method of the FileInputStream is called, the java process makes an OS call to read a byte from the file in the disk. The OS makes use of DMA(Direct Memory Access) to copy the requested content from the disk to the page cache in the main memory. Page Cache is a cache maintained by the OS for fast and efficient read/writes. This content is then copied from the page cache to the application cache(java heap).

The problem with using FileInputStream.read(..) method is that it reads in byte. Every read(..) call will theoretically involve an IO call to the disk to read one byte. However, IO calls to disk are extrememly slow. So, reading a 4MB(4194304 Bytes) file would involve 4194304 IO calls. And the larger the file size, the slower it's to read the full file. Fortunately it's not as bad as 4194304 IO calls. Eventhough it's theoretically 4194304 IO calls, practically it's much lesser than that due to [OS pages](https://en.wikipedia.org/wiki/Page_(computer_memory)).

Page size is usually 4KB(depends on the OS). The OS reads/writes from/to the disk in multiples of the page size. So, in our case eventhough the java process wants to read 1 Byte for every read(..) call, the OS reads 4KB(4096 Bytes) from the disk and the next 4095 read(..) calls are directly served from the page cache without going to the disk. So, approximately only 1024 (4MB/4KB) IO calls are made to read a 4MB file in an OS that has a page size of 4KB.

This is good for small files, but for large files this is still pretty slow. We can improve the speed by buffering the stream.


### Buffered streams

We can make use of Buffered streams to read files much faster. 

```java

//A Buffer of size 40KB(40*4096) over the fileinputstream
BufferedInputStream bs = new BufferedInputStream(new FileInputStream(file), 40*4096);
int data;
while ((data = bs.read()) != -1) {
	System.out.print(data);
}

```

We are creating a buffer of 40KB to read the file. So you can think that the java process, instead of asking the OS to read 1 Byte, will now ask the OS to read 40KB and store the data in the buffer. Now every read(..) call will read from the buffer till the buffer is empty. This greatly speeds up the IO operations.

Some points to consider while setting the buffer size

1) The buffer size should always be a multiple of the page size(think why it's so)

2) It should also depend on the size of the file you want to read/write.

3) A very large buffer size can have detrimental effect on the performance.


### Does Buffering solve every problem?

Buffering greatly improves IO operation's performance, however there are still some loopholes associated with the normal way of reading/writing files.

To understand why, we need to understand how bytes are transferred between the java process and the disk.

Whenever the java process needs to read a file, the java process makes an OS call to read the specified number of bytes from the file. The OS makes use of DMA(Direct Memory Access) to copy the requested content from the disk to the page cache in the main memory. Note that DMA does not involve any CPU cycles, so the CPU cycles are available for processes to execute instructions. The DMA copies the content from the disk to the OS' page cache and not directly to the application's cache(in this case the Java heap). This is a limitation provided by the OS for various reasons such as security, data consistency, etc. This data needs to be copied from the page cache to the java heap. The copying of data from the page cache to the java heap involves CPU cycles. The larger the data size, the more the CPU cycles needed. Also, one more thing to note is that the data is duplicated - one in the page cache and one in the java heap. The larger the data size the more the memory required (almost double).

![Normal IO]({{site.ourl}}/static/img/normal_io.svg)

As you could have guessed by now, there are some limitations to this approach of reading/writing data.

1) Duplication of data in page cache and application cache. So, larger data will need much more memory.

2) While copying of data from file to Page cache (DMA) involves no CPU cycles, copying from page cache to application cache involves CPU cycles. Larger data means more CPU cycles. This means lesser available CPU cycles for other processes while copying and larger execution time.


### Memory Mapped IO to the rescue

In order to avoid the data duplication and extra CPU cycles, Memory Mapped IO came into picture. Memory Mapped IO is pretty similar to a normal IO, except that it uses a common cache to read/write data. We can read a specific section of a file using Memory mapped IO.

[Virtual memory](https://en.wikipedia.org/wiki/Virtual_memory) is a concept supported by most OS. It's one in which processes have a huge amount of memory(much more than the physical memory - RAM) for usage. It uses the disk to fill up the extra memory requirement beyond the physical memory limit. Memory Mapped IO uses virtual addresses to achieve the common cache. Virtual memory is usually much larger than the physical memory; and hence there's a lot more virtual addresses than the physical addresses. Both the page cache and the application cache uses virtual addresses that point to the same physical address where the requested data is available.


```java

FileInputStream fs = new FileInputStream(file);
//map the entire 40MB for read-only operations
MappedByteBuffer buff = fs.getChannel().map(FileChannel.MapMode.READ, 0, 4194304);

```
![Normal IO]({{site.ourl}}/static/img/mm_io.svg)

This ensures that both the application and the cache reads the data from the same physical location, thus eliminating data duplication and the extra CPU cycles. Thus Memory mapped IO is a lot faster than the normal IO for large files. It also takes less memory.


### Is Memory Mapped IO good for every case

As the saying goes "Nothing is good for everything". Memory Mapped IO has it fair share of cons. We'll list some below

1) Since the page cache and application are referring to the same data in memory, any changes to the file being read will directly reflect in the application. In contrast, application reading file using buffering will only see what was already loaded into the buffer. 

2) The application directly interacts with the data that's referred by the page cache. So, any inconsistent write by the application to the data will reflect immediately in the actual file. For example if the java process crashes while doing a memory mapped write, the inconsistent data is immediately written to the file. 

3) Trying to map a huge file can result in a lot of page faults, which will severely impact the IO performance.

4) The size of the data being mapped also depends on the system architecture. For a 32 bit architecture, we can only load at the max 2^32 bytes. 


Having said all these, Memory Mapped IO is still very useful and extremely fast when reading large/huge files. Please take caution when writting use Memory mapped IO as it's like writing directly to the file without any intermediary. As long as your application is stable and is functionally correct, you need not worry much about this.


Hope you will consider using Memory mapped IO for reading/writing large files in your application. The right usage of Memory mapped IO can bring in drastic improvement in your application's performance.
