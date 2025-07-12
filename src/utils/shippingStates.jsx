// Prefix table of zip codes by state (first 2 digits only)
const stateZipPrefixes = [
    { state: "AC", prefixes: ["69"] },
    { state: "AL", prefixes: ["57"] },
    { state: "AM", prefixes: ["69"] },
    { state: "AP", prefixes: ["68"] },
    { state: "BA", prefixes: ["40", "41", "42", "43", "44", "45", "46"] },
    { state: "CE", prefixes: ["60", "61", "62", "63"] },
    { state: "DF", prefixes: ["70", "71", "72", "73", "74", "75"] },
    { state: "ES", prefixes: ["29"] },
    { state: "GO", prefixes: ["72", "73", "74", "75", "76", "77"] },
    { state: "MA", prefixes: ["65", "66"] },
    { state: "MT", prefixes: ["78"] },
    { state: "MS", prefixes: ["79"] },
    { state: "MG", prefixes: ["30", "31", "32", "33", "34", "35", "36", "37"] },
    { state: "PA", prefixes: ["66", "67", "68"] },
    { state: "PB", prefixes: ["58"] },
    { state: "PR", prefixes: ["80", "81", "82", "83", "84", "85", "86", "87", "88"] },
    { state: "PE", prefixes: ["50", "51", "52", "53", "54", "55"] },
    { state: "PI", prefixes: ["64"] },
    { state: "RJ", prefixes: ["20", "21", "22", "23", "24"] },
    { state: "RN", prefixes: ["59"] },
    { state: "RS", prefixes: ["90", "91", "92", "93", "94", "95", "96", "97", "98", "99"] },
    { state: "RO", prefixes: ["76"] },
    { state: "RR", prefixes: ["69"] },
    { state: "SC", prefixes: ["88", "89"] },
    { state: "SE", prefixes: ["49"] },
    { state: "SP", prefixes: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"] },
    { state: "TO", prefixes: ["77"] },
];

// Simulated shipping values by state (change as needed)
const stateShippingValues = {
    "AC": 40,
    "AL": 28,
    "AM": 45,
    "AP": 38,
    "BA": 25,
    "CE": 27,
    "DF": 18,
    "ES": 17,
    "GO": 19,
    "MA": 32,
    "MT": 30,
    "MS": 29,
    "MG": 15,
    "PA": 34,
    "PB": 26,
    "PR": 16,
    "PE": 24,
    "PI": 31,
    "RJ": 14,
    "RN": 27,
    "RS": 22,
    "RO": 37,
    "RR": 41,
    "SC": 21,
    "SE": 28,
    "SP": 10,
    "TO": 33,
};

export function calculateShippingByZipcode(zip) {
    if (!zip || zip.length < 2) return 0;
    const prefix = zip.replace(/\D/g, '').substring(0, 2);
    let state = "";
    stateZipPrefixes.forEach(e => {
        if (e.prefixes.includes(prefix)) state = e.state;
    });
    return state ? (stateShippingValues[state] || 20) : 20; // default value if state not found
}