
it('Bohdan mortgage', () => {

//add cookies to constant
const cookieMap = new Map();
cookieMap.set('365CCC','true')
    .set('365CCC_basic','false')
    .set('365CCC_marketing','false')
    .set('365CCC_analytics','false')
    .set('365CCC_exp','1680717725429');

//set all cookies to browser
cookieMap.forEach((value, key) => {
    localStorage.setItem(key,value)
});   

//open 365.bank page and hypo page
cy.visit('https://www.365.bank');
cy.visit('https://365.bank/kalkulacky/hypotekarna-kalkulacka');

//add mortgage params to map
const hypoMap = new Map();
hypoMap.set('estateValue','150000')
    .set('mortgageValue','100000')
    .set('duration','23');

//set mortgage based on hypo params and ASSERT (could be split)
hypoMap.forEach((value,key) => {
    cy.get('input[name=' + key + 'Range]')
        .invoke('val', value)
        .trigger('change');
    cy.get('input[name=' + key + 'Input]')
        .should('have.value',value)
        .should('be.visible')
        .should('be.enabled')
    });

//set fixation period
cy.contains('div','5 rokov')
    .click();

//check eco mortgage checkbox
cy.get('[type="checkbox"]').check({force:true}).should('be.checked');

//assert values of monthly payment and interest rate 
cy.get('[class*="monthlyPayment"]').invoke('text').should('match',/^[1-9]\d*s\€\s[\/] mesiac/);
cy.get('[class*="interestToDisplay"]').invoke('text').should('match',/^[+-]?((\d+(\.\d*)?)|(\.\d+))\s%\sročne/);

//confirm interest
cy.contains('Idem do toho ➜').click();
//assert interest url
cy.url().should('eq','https://365.bank/mam-zaujem/hypoteka');

});