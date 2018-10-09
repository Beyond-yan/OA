package com.gdssoft.core.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.security.auth.callback.Callback;
import javax.security.auth.callback.CallbackHandler;
import javax.security.auth.callback.UnsupportedCallbackException;

import org.apache.ws.security.WSPasswordCallback;
import org.apache.ws.security.WSSecurityException;

public class CxfServiceInterceptor implements CallbackHandler {

	private Map<String, String> passwords = new HashMap<String, String>();

	public CxfServiceInterceptor() {
		passwords = new HashMap<String, String>();
		passwords.put("admin", "admin");
	}

	@Override
	public void handle(Callback[] callbacks) throws IOException,
			UnsupportedCallbackException {

		WSPasswordCallback pc = (WSPasswordCallback) callbacks[0];
		if (!passwords.containsKey(pc.getIdentifier()))
			throw new SecurityException("用户不匹配！");
		String pass = passwords.get(pc.getIdentifier());
		String pwd = pc.getPassword();
		if (pwd == null || !pwd.equals(pass))
			throw new SecurityException("密码不匹配！");
	}
}
