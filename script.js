$(document).ready(() => {
  let countries; 

  const getCountries = (apiUrl) => {
      console.log("API URL:", apiUrl); 
      $.ajax({
          url: apiUrl,
          type: "GET",
          success: (data) => {
              countries = data; 
              displayCountries(countries);
              if (countries.length > 0) {
                  displayCountryDetails(countries[0]);
              }
          },
          error: () => {
              displayError();
          }
      });
  };

  const filterCountries = () => {
      const search= $('.search-input').val().toLowerCase();
      const filteredCountries = countries.filter(country => {
          return country.name.common.toLowerCase().startsWith(search);
      });
      displayCountries(filteredCountries)
  };

  const displayCountries = (countries) => {
      let countriesHtml = "";
      $.each(countries, (index, country) => {
          let countryHtml = 
          `<a href="details.html?country=${encodeURIComponent(country.name.common)}" class="country scale-effect" data-country-name="${country.name.common}">
              <div class="country-flag">
                  <img src="${country.flags.png}" alt="${country.name.common} Flag" />
              </div>
              <div class="country-info">
                  <h2 class="country-title">${country.name.common}</h2>
                  <ul class="country-brief">
                      <li><strong>Population: </strong>${country.population}</li>
                      <li><strong>Region: </strong>${country.region}</li>
                      <li><strong>Capital: </strong>${country.capital}</li>
                  </ul>
              </div>
          </a>`;

          countriesHtml += countryHtml;
      });
      $("#countriesGrid").html(countriesHtml);
  };

  const fetchCountryDetails = (countryName) => {
      const apiUrl = `https://restcountries.com/v3.1/name/${countryName}`;
      $.ajax({
          url: apiUrl,
          type: "GET",
          success: (data) => {
              const country = data[0]; // Assuming the first result is the correct country
              displayCountryDetails(country);
          },
          error: () => {
              displayError();
          }
      });
  };

  const displayCountryDetails = (country) => {
      const countryDetailsHtml =
      `<h2>${country.name.common}</h2>
      <img src="${country.flags.png}" alt="${country.name.common} Flag" />
      <p>Population: ${country.population}</p>
      <p>Region: ${country.region}</p>
      <p>Capital: ${country.capital}</p>`;
      $(".country-details").html(countryDetailsHtml);
  };

  const displayError = () => {
      $("#countriesGrid").html("<p>Error reading API</p>");
  };

  const getQueryParam = (name) => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
  };

  $('#continent-filter').on('change', function() {
      const selectedContinent = $(this).val();
      let apiUrl = "https://restcountries.com/v3.1/all";

      if (selectedContinent !== 'all') {
          apiUrl = `https://restcountries.com/v3.1/region/${selectedContinent}`;
      }

      getCountries(apiUrl);
  });

  const countryName = getQueryParam("country");

  if (countryName) {
      fetchCountryDetails(countryName);
  } else {
      getCountries("https://restcountries.com/v3.1/all");
  }

  $('.search-input').on('input', filterCountries);

  $(document).on('click', '.country', function(event) {
      event.preventDefault(); 
      const countryName = $(this).data('country-name');
      window.location.href = `details.html?country=${encodeURIComponent(countryName)}`; 
  });
});
