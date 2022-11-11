function ndist(z) {
    return (1.0 / (Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z);
    //??  Math.exp(-0.5*z*z)
}

function N(z) {
    var b1 = 0.31938153;
    var b2 = -0.356563782;
    var b3 = 1.781477937;
    var b4 = -1.821255978;
    var b5 = 1.330274429;
    var p = 0.2316419;
    var c2 = 0.3989423;
    var a = Math.abs(z);
    if (a > 6.0) { return 1.0; }
    var t = 1.0 / (1.0 + a * p);
    var b = c2 * Math.exp((-z) * (z / 2.0));
    var n = ((((b5 * t + b4) * t + b3) * t + b2) * t + b1) * t;
    n = 1.0 - b * n;
    if (z < 0.0) { n = 1.0 - n; }
    return n;
}

export const black_scholes = (call, S, X, r, v, t) => {
    // call = Boolean (to calc call, call=True, put: call=false)
    // S = stock prics, X = strike price, r = no-risk interest rate
    // v = volitility (1 std dev of S for (1 yr? 1 month?, you pick)
    // t = time to maturity
    // console.log(call, S, X, r, v, t)
    // define some temp vars, to minimize function calls
    var sqt = Math.sqrt(t);
    var Nd2;  //N(d2), used often
    var nd1;  //n(d1), also used often
    var ert;  //e(-rt), ditto
    var delta;  //The delta of the option

    var d1 = (Math.log(S / X) + r * t) / (v * sqt) + 0.5 * (v * sqt);
    var d2 = d1 - (v * sqt);

    if (call) {
        delta = N(d1);
        Nd2 = N(d2);
    } else { //put
        delta = -N(-d1);
        Nd2 = -N(-d2);
    }

    ert = Math.exp(-r * t);
    nd1 = ndist(d1);

    // var gamma = nd1 / (S * v * sqt);
    // var vega = S * sqt * nd1;
    // var theta = -(S * v * nd1) / (2 * sqt) - r * X * ert * Nd2;
    // var rho = X * t * ert * Nd2;

    return (S * delta - X * ert * Nd2);

}

function getDelta(call, S, X, r, v, t) {
    // call = Boolean (to calc call, call=True, put: call=false)
    // S = stock prics, X = strike price, r = no-risk interest rate
    // v = volitility (1 std dev of S for (1 yr? 1 month?, you pick)
    // t = time to maturity

    // define some temp vars, to minimize function calls
    var sqt = Math.sqrt(t);
    var Nd2;  //N(d2), used often
    var nd1;  //n(d1), also used often
    var ert;  //e(-rt), ditto
    var delta;  //The delta of the option

    d1 = (Math.log(S / X) + r * t) / (v * sqt) + 0.5 * (v * sqt);
    d2 = d1 - (v * sqt);

    if (call) {
        delta = N(d1);
    } else { //put
        delta = -N(-d1);
    }

    return delta;

} //end of black_scholes