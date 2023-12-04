const { expect } = require("chai");
const { ethers } = require("hardhat");
 
describe("Crowdfunding", function () {
  let crowdfunding;
  let admin;
  let otherAccount;
  let campaign_id;
  let owner;
  let title;
  let description;
  let target;
  let deadline;
  let amountcollected;
  let image;
  let donators;
  let donations;
  let donatur;
  let amount;
  let date;
  let withdrawer;
  let recipient;
 
  before(async function () {
    [admin, otherAccount] = await ethers.getSigners();
    let Crowdfunding = await ethers.getContractFactory("Crowdfunding");
    crowdfunding = await Crowdfunding.deploy();
  });
 
  describe("createCampaign", function () {
    it("Should add a book successfully", async function () {
      await crowdfunding.createCampaign(campaign_id,owner,title,description,target,deadline,image);
      const campaign = await crowdfunding.campaign(campaign_id);
      expect(crowdfunding.campaign_id).to.equal(campaign_id);
      expect(crowdfunding.owner).to.equal(owner);
      expect(crowdfunding.title).to.equal(title);
      expect(crowdfunding.description).to.equal(description);
      expect(crowdfunding.target).to.equal(target);
      expect(crowdfunding.deadline).to.equal(deadline);
      expect(crowdfunding.image).to.equal(image);
    });

    it("Should revert if caller is not admin", async function () {
      await expect(
        library.connect(otherAccount).addBook(ISBN, title, 2025, "Alice Johnson")
      ).to.be.revertedWith("Only admin can perform this action");
    });
 
    it("Should revert if book with same ISBN already exists", async function () {
      await expect(
        library.addBook(ISBN, title, 2025, "Alice Johnson")
      ).to.be.revertedWith("Book with this ISBN already exists");
    });
  });
 
  describe("updateCampaign", function () {
    it("Should update a book successfully", async function () {
      const newTitle = "Updated Book";
      await library.updateBook(ISBN, newTitle, 2025, "Alice Johnson");
      const book = await library.books(ISBN);
      expect(book.title).to.equal(newTitle);
    });

    it("Should revert if caller is not admin", async function () {
      await expect(
        library.connect(otherAccount).updateBook(ISBN, title, 2025, "Alice Johnson")
      ).to.be.revertedWith("Only admin can perform this action");
    });
 
    it("Should revert if book does not exist", async function () {
      await expect(
        library.updateBook("9876543210", "Updated Book", 2025, "Alice Johnson")
      ).to.be.revertedWith("Book with this ISBN does not exist");
    });
  });
 
  describe("deleteCampaign", function () {
    it("Should delete a book successfully", async function () {
      await library.deleteBook(ISBN);
      const book = await library.books(ISBN);
      expect(book.ISBN).to.equal("");
    });

    it("Should revert if caller is not admin", async function () {
      await expect(
        library.connect(otherAccount).deleteBook(ISBN)
      ).to.be.revertedWith("Only admin can perform this action");
    });
 
    it("Should revert if book does not exist", async function () {
      await expect(library.deleteBook("9876543210")).to.be.revertedWith(
        "Book with this ISBN does not exist"
      );
    });
  });
 
  describe("getCampaignInfo", function () {
    it("Should retrieve book information successfully", async function () {
      await library.addBook(ISBN, title, year, author);
      const [isbn, bookTitle, bookYear, bookAuthor] = await library.getBook(
        ISBN
      );
      expect(isbn).to.equal(ISBN);
      expect(bookTitle).to.equal(title);
      expect(bookYear).to.equal(year);
      expect(bookAuthor).to.equal(author);
    });
 
    it("Should revert if book does not exist", async function () {
      await expect(library.getBook("9876543210")).to.be.revertedWith(
        "Book with this ISBN does not exist"
      );
    });
  });
});