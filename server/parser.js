const axios = require('axios');
const cheerio = require('cheerio');
const Fs = require('fs');
const Path = require('path');


module.exports = {
  getDrugsData: async function(pzn) {
        const url = `https://www.arzneimittel-datenbank.de/search/${pzn}`;
        try {
          const response = await axios.get(url);
          const $ = cheerio.load(response.data);
      
          const name = $('div>h1').text();
          if (name == '') {
              console.log("The product was not found");
              return undefined;
          }
            
          const description = $('.description>p:nth-child(2)').text().trim();
      
          const img = 'https://www.arzneimittel-datenbank.de/' + $('.replace-2x').attr('src');

          return { name, description, img }
          
        } catch (e) {
          console.error(`${e.message}`);
        }
    }
  };