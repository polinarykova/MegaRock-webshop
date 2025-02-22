export default function TitleAndInfoSection() {
    return (
    <div className="flex flex-col items-center px-6 md:px-12">
        <hr className="border-gray-500 w-full my-4" />
        <h1 className="text-5xl font-extrabold text-blue-500 text-center mb-6">
          {'MEGARock majice - Sell off'}
        </h1>
        <hr className="border-gray-500 w-full mb-4" />

        <div className="text-lg text-white max-w-5xl space-y-6 mb-20 bg-gray-500 rounded-lg p-8 shadow-lg mt-12">
          <p className="leading-relaxed">
            {'Predstavljamo jednostavan '}
            <span className="font-semibold text-blue-400">{'webshop'}</span>
            {' gdje možete pronaći klupske majice koje još nisu našle svoje vlasnike. Dostupne boje i veličine su ograničene.'}
          </p>
          <p className="leading-relaxed">
            {'Webshop radi na principu '}
            <span className="font-semibold text-blue-400">{'"jedna majica - jedna narudžba"'}</span>
            {'. Ako želite naručiti više majica, potrebno je napraviti više narudžbi. Cijena jedne majice je'} <span className="font-semibold text-blue-400">{'5€'}</span>{'.'}
          </p>
          <p className="leading-relaxed">
            {'Odaberite željeni izgled majice, veličinu i unesite kontakt podatke. Nakon što zaprimimo vašu narudžbu, poslat ćemo vam '}
            <span className="font-semibold text-blue-400">{'uplatnicu'}</span>
            {' putem sustava kojeg koristimo i za članarine i ostale uplate.'}
          </p>
        </div>
      </div>
    );
}
