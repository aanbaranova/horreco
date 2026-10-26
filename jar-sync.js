// Saves each jar's progress to the user's account, so it shows the same on every device.
// Loaded in the head of every jar page. Does not change the design.
(function () {
  var SUPABASE_URL = 'https://rkyawxfzfueqfgzgkkkt.supabase.co';
  var KEY = 'sb_publishable_29NoCpu3W89C8fueHo5_Rw_QWcnY48w';
  var id = new URLSearchParams(location.search).get('id');
  if (!id) return;
  var stateKey = 'timejar_state_' + id;

  function findSession() {
    try {
      var keys = Object.keys(localStorage).filter(function (k) { return /^sb-.*-auth-token$/.test(k); });
      for (var i = 0; i < keys.length; i++) {
        var s = JSON.parse(localStorage.getItem(keys[i]) || 'null');
        if (s && s.access_token) return { key: keys[i], s: s };
      }
    } catch (e) {}
    return null;
  }

  async function accessToken() {
    var f = findSession();
    if (!f) return null;
    var s = f.s;
    if (!s.expires_at || s.expires_at * 1000 - Date.now() > 60000 || !s.refresh_token) return s.access_token;
    try {
      var r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=refresh_token', {
        method: 'POST',
        headers: { 'apikey': KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: s.refresh_token })
      });
      if (!r.ok) return s.access_token;
      var n = await r.json();
      Storage.prototype.setItem.call(localStorage, f.key, JSON.stringify(Object.assign({}, s, n)));
      return n.access_token;
    } catch (e) { return s.access_token; }
  }

  async function push(value, keepalive) {
    var t = await accessToken();
    if (!t) return;
    var state = null;
    try { state = value === null ? null : JSON.parse(value); } catch (e) { return; }
    fetch(SUPABASE_URL + '/rest/v1/user_jars?id=eq.' + encodeURIComponent(id), {
      method: 'PATCH',
      keepalive: !!keepalive,
      headers: { 'apikey': KEY, 'Authorization': 'Bearer ' + t, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ state: state })
    }).catch(function () {});
  }

  var timer = null, pending = null;
  var origSet = Storage.prototype.setItem;
  Storage.prototype.setItem = function (k, v) {
    origSet.apply(this, arguments);
    if (this === localStorage && k === stateKey) {
      pending = String(v);
      clearTimeout(timer);
      timer = setTimeout(function () { var p = pending; pending = null; push(p); }, 400);
    }
  };
  window.addEventListener('pagehide', function () {
    if (pending !== null) { var p = pending; pending = null; push(p, true); }
  });
})();
