# ERPNext Story

<!-- no-sidebar -->

<p class="lead text-muted mb-5">Why someone would start a new open source ERP (Enterprise Resource Planning) project? If I had known what it takes, I might not have done it! But I did not know that in 2006...</p>

I had just joined my family business (furniture manufacturing) and the company was reeling under a bad ERP implementation. It was a local vendor who was building it out on the .NET platform, and after sinking a reasonable sum of money into it, he was not able to get it right. At that point, my faith in the entire ERP industry was pretty low. Either they were too expensive or they were very buggy.

Later, I heard the same story from many of my users. But in all my foolishness and enthusiasm, I started writing out my own ERP system. I was always a hobbyist programmer, and maybe I had too much faith in my ability, but somehow we got started. In a couple of years though, the family business was sold and I was on my own. I decided to keep building the ERP and see if I could get more users, so I started my own company in 2008 to productize the ERP that I was building. At that point, what I had built was just about holding and not good enough to be a product, so I rewrote it (a couple of times!). And in 2010, we named the project ERPNext and launched it on a Software as a Service (SAAS) business model. And as you would expect, the going was tough.

No one wanted to buy an ERP from a startup. ERPs are mission critical assets for a company, and they don't mind overspending because the cost of failure is high. A failed ERP implementation could cost customer happiness, employee happiness, and in some extreme cases, the company itself. Also since our pricing was very low, we found that engagement was not very high. But even then, a few users saw potential in our product.

### Open source code

We licensed the code under the General Public License, and the code had been online on Google Code since 2009, but we never really positioned ourselves as an open source product initially. There were no clear deployment instructions, very sparse documentation and no community forum. Being in India, we had very little exposure to what an open source community was like and how to build an open source product. Though I had read all about the Free Software movement and read Linus Torvald's book, I understood the concept, but did not know how to start executing it.

In 2011, we moved from Google Code to GitHub, and that proved to be a turning point. Now, suddenly, we were in the company of many open source projects and it felt nice to start using GitHub's workflows, issues lists, and more to make ourselves more friendly to the community. Slowly, in 2012, we started positioning ourselves more as an open source ERP, and very slowly we saw more activity on our mailing list and an occasional issue raised by the community.

In 2013, we revamped our deployment architecture to become more Pythonic (WSGI) and also started giving out free virtual machines for users to evalute and use. This kickstarted a community. Today we have more than 1000 people on our discussion forum, and we believe there could be around 500 companies using our ERP at different stages. In the process, we have close to 300 users using our paid services (hosting or deployment support), and we even managed to get a couple of sponsors.

### Wordpress for ERPs

Our end goal is to become a Wordpress like tool for ERPs. Even though there are millions of small businesses around the world who could all use better systems to manage their organizations, they are stuck using simple accounting tools. Until now it was only the large companies that could take benefit of the efficiencies and control that an end-to-end information system like an ERP could give. In EPRNext, we have included CRM (customer relationship management), project management, and payroll as modules that come right out of the box. For companies that deal in widgets, we also have advanced features like serialized and batched inventory that are hard to find in many mature products.

Another key aspect of the industry is that users would need an IT consulting company to implement and customize an ERP. We want to change that. ERPs should be simple enough to be self-implemented. This is why users are selecting ERPNext over other alternatives, because we are completely focused on the do-it-yourself user. There are a couple of good open source ERPs out there, but they are still hard to configure and need a partner to help you get started.

### The business of open source

Anyone who knows this space knows that there are is a big divide in the community. The free software proponents and then the commercial open source ones. Our focus has always been to stay clear of this debate, and we believe both are right in their own way. The commerical players feel we are too open source: we do not have paid modules and we have made deployment ridiculously easy. The free software proponents feel suspicious of anything commercial.

What helps us is that we have decided to monetize only from our hosting services. We also offer support to developer teams, but we do not make any money from implementation, deployment, or customization. This helps to keep our objectives clear and makes it very easy for the community to use the product and also participate. Another thing that helps is that we are a very small team and do not plan for very quick growth. This helps us not put pressure to monetize from the community.

### The way forward

We believe we have today a very usable and robust ERP system for small businesses. Even large businesses can use it, but we are not particlarly interested in that avenue because it would require services, and we are happy to let independent vendors do that. Our project has reached a reasonable community size and we can feel there is a good momentum with the number of users who are evaluating the product every day.

We need to focus on making things even easier for the end user and providing adequate documetation for the developer. Our framework Frappe, allows rapid application development and provides a platform to create apps or extensions to the product. With most of the basics in place, we think the ERP market is poised for a major disruption in the next five years.

Our biggest satisfaction will be when a whole bunch of small, local, innovative organizations across the world gets access to tools that will help them compete with large, global, and inefficient corporations—creating a level playing field that will leave our world a little bit more fair.

<br>
Rushabh Mehta<br>
Founder<br>
ERPNext and Frappe

---

Here is a slightly dated (April 2013) video of our team:

<div style="max-width: 500px;">
<div class="embed-responsive embed-responsive-4by3">
  <iframe class="embed-responsive-item" src="//www.youtube.com/embed/zRoFnqN6kPU?feature=player_embedded"></iframe>
</div>
</div>
