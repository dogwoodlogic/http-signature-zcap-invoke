const {signCapabilityInvocation} = require('../index');
const {Ed25519KeyPair} = require('crypto-ld');
const {shouldBeAnAuthorizedRequest} = require('./test-assertions');

// TODO verify results using zvap-verify

/**
 * Reading
 * @see https://w3c-ccg.github.io/zcap-ld/
 */

describe('signCapabilityInvocation', function() {
  let ed25519Key, keyId = null;
  before(async function() {
    ed25519Key = await Ed25519KeyPair.generate();
    keyId = 'did:key:foo';
    ed25519Key.id = keyId;
  });

  describe('should sign', function() {

    it('a valid root zCap', async function() {
      const invocationSigner = ed25519Key.signer();
      invocationSigner.id = keyId;
      const signed = await signCapabilityInvocation({
        url: 'https://www.test.org/read/foo',
        method: 'GET',
        headers: {
          keyId,
          date: new Date().toUTCString()
        },
        json: {foo: true},
        invocationSigner,
        capabilityAction: 'read'
      });
      shouldBeAnAuthorizedRequest(signed);
      signed.digest.should.exist;
      signed.digest.should.be.a('string');
    });

    it('a valid zCap with a capability string', async function() {
      const invocationSigner = ed25519Key.signer();
      invocationSigner.id = keyId;
      const signed = await signCapabilityInvocation({
        url: 'https://www.test.org/read/foo',
        method: 'GET',
        headers: {
          keyId,
          date: new Date().toUTCString()
        },
        json: {foo: true},
        invocationSigner,
        capability: 'test',
        capabilityAction: 'read'
      });
      shouldBeAnAuthorizedRequest(signed);
      signed.digest.should.exist;
      signed.digest.should.be.a('string');
    });

    it('a valid zCap with a capability object', async function() {
      const invocationSigner = ed25519Key.signer();
      invocationSigner.id = keyId;
      const signed = await signCapabilityInvocation({
        url: 'https://www.test.org/read/foo',
        method: 'GET',
        headers: {
          keyId,
          date: new Date().toUTCString()
        },
        json: {foo: true},
        invocationSigner,
        capability: {id: 'test'},
        capabilityAction: 'read'
      });
      shouldBeAnAuthorizedRequest(signed);
      signed.digest.should.exist;
      signed.digest.should.be.a('string');
    });

    it('a valid root zCap with host in the headers', async function() {
      const invocationSigner = ed25519Key.signer();
      invocationSigner.id = keyId;
      const signed = await signCapabilityInvocation({
        url: 'https://www.test.org/read/foo',
        method: 'GET',
        headers: {
          host: 'www.test.org',
          keyId,
          date: new Date().toUTCString()
        },
        json: {foo: true},
        invocationSigner,
        capabilityAction: 'read'
      });
      shouldBeAnAuthorizedRequest(signed);
      signed.digest.should.exist;
      signed.digest.should.be.a('string');
    });

    it('a valid root zCap with a capabilityAction', async function() {
      const invocationSigner = ed25519Key.signer();
      invocationSigner.id = keyId;
      const signed = await signCapabilityInvocation({
        url: 'https://www.test.org/read/foo',
        method: 'GET',
        headers: {
          keyId,
          date: new Date().toUTCString()
        },
        json: {foo: true},
        invocationSigner,
        capabilityAction: 'action'
      });
      shouldBeAnAuthorizedRequest(signed);
      signed.digest.should.exist;
      signed.digest.should.be.a('string');
    });

    it('a valid root zCap with out json', async function() {
      const invocationSigner = ed25519Key.signer();
      invocationSigner.id = keyId;
      const signed = await signCapabilityInvocation({
        url: 'https://www.test.org/read/foo',
        method: 'GET',
        headers: {
          keyId,
          date: new Date().toUTCString()
        },
        invocationSigner,
        capabilityAction: 'read'
      });
      shouldBeAnAuthorizedRequest(signed);
      should.not.exist(signed.digest);
    });

    it('a valid root zCap with digest', async function() {
      const invocationSigner = ed25519Key.signer();
      invocationSigner.id = keyId;
      const signed = await signCapabilityInvocation({
        url: 'https://www.test.org/read/foo',
        method: 'GET',
        headers: {
          digest: 'f93a541ae8cd64d13d4054abacccb1cb',
          keyId,
          date: new Date().toUTCString()
        },
        invocationSigner,
        capabilityAction: 'read'
      });
      shouldBeAnAuthorizedRequest(signed);
      signed.digest.should.exist;
      signed.digest.should.be.a('string');
    });

    it('a root zCap with out a capabilityAction', async function() {
      const invocationSigner = ed25519Key.signer();
      invocationSigner.id = keyId;
      const signed = await signCapabilityInvocation({
        url: 'https://www.test.org/read/foo',
        method: 'GET',
        headers: {
          keyId,
          date: new Date().toUTCString()
        },
        json: {foo: true},
        invocationSigner,
        capability: 'test'
      });
      shouldBeAnAuthorizedRequest(signed);
      signed.digest.should.exist;
      signed.digest.should.be.a('string');
    });

    it('a valid root zCap with UPPERCASE headers', async function() {
      const invocationSigner = ed25519Key.signer();
      invocationSigner.id = keyId;
      const signed = await signCapabilityInvocation({
        url: 'https://www.test.org/read/foo',
        method: 'GET',
        headers: {
          KEYID: keyId,
          DATE: new Date().toUTCString()
        },
        json: {foo: true},
        invocationSigner,
        capabilityAction: 'read'
      });
      shouldBeAnAuthorizedRequest(signed);
      signed.digest.should.exist;
      signed.digest.should.be.a('string');
    });

  });

  describe('should NOT sign', function() {

    it('a root zCap with out a method', async function() {
      const invocationSigner = ed25519Key.signer();
      invocationSigner.id = keyId;
      let error, result = null;
      try {
        result = await signCapabilityInvocation({
          url: 'https://www.test.org/read/foo',
          method: undefined,
          headers: {
            keyId,
            date: new Date().toUTCString()
          },
          json: {foo: true},
          invocationSigner,
          capabilityAction: 'read'
        });
      } catch(e) {
        error = e;
      }
      should.not.exist(result);
      should.exist(error);
      error.should.be.an.instanceOf(Error);
      error.code.should.exist;
      error.code.should.be.a('string');
      error.code.should.contain('ERR_ASSERTION');
    });

    it('a root zCap with out headers', async function() {
      const invocationSigner = ed25519Key.signer();
      invocationSigner.id = keyId;
      let error, result = null;
      try {
        result = await signCapabilityInvocation({
          url: 'https://www.test.org/read/foo',
          method: 'post',
          headers: undefined,
          json: {foo: true},
          invocationSigner,
          capabilityAction: 'read'
        });
      } catch(e) {
        error = e;
      }
      should.not.exist(result);
      should.exist(error);
      error.should.be.an.instanceOf(Error);
      error.name.should.contain('TypeError');
      error.message.should.contain(
        'Cannot convert undefined or null to object');
    });

    it('a root zCap with out an invocationSigner', async function() {
      let error, result = null;
      try {
        result = await signCapabilityInvocation({
          url: 'https://www.test.org/read/foo',
          method: 'post',
          headers: {
            keyId,
            date: new Date().toUTCString()
          },
          json: {foo: true},
          capabilityAction: 'read'
        });
      } catch(e) {
        error = e;
      }
      should.not.exist(result);
      should.exist(error);
      error.should.be.an.instanceOf(Error);
      error.message.should.contain('invocationSigner');
    });

    it('a root zCap with out a url and host', async function() {
      const invocationSigner = ed25519Key.signer();
      invocationSigner.id = keyId;
      let error, result = null;
      try {
        result = await signCapabilityInvocation({
          method: 'post',
          headers: {
            keyId,
            date: new Date().toUTCString()
          },
          json: {foo: true},
          invocationSigner,
          capabilityAction: 'read'
        });
      } catch(e) {
        error = e;
      }
      should.not.exist(result);
      should.exist(error);
      error.should.be.an.instanceOf(Error);
      error.name.should.contain('TypeError');
      error.message.should.contain('Invalid URL');
    });

  });
});
