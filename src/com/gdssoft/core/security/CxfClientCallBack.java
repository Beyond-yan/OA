package com.gdssoft.core.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.security.auth.callback.Callback;
import javax.security.auth.callback.CallbackHandler;
import javax.security.auth.callback.UnsupportedCallbackException;
import org.apache.ws.security.WSPasswordCallback;

public class CxfClientCallBack implements CallbackHandler {
	private Map<String, String> passwords = new HashMap<String, String>();
    public CxfClientCallBack() {
        passwords.put("admin", "admin");
        passwords.put("test", "123");
    }

    @Override
    public void handle(Callback[] callbacks) throws IOException, UnsupportedCallbackException {
        for (int i = 0; i < callbacks.length; i++) {
            WSPasswordCallback pc = (WSPasswordCallback) callbacks[i];
            int usage = pc.getUsage();
            if (!passwords.containsKey(pc.getIdentifier()))
                throw new SecurityException("用户【" + pc.getIdentifier() + "】不存在！");

            String pass = passwords.get(pc.getIdentifier());

            if (usage == WSPasswordCallback.USERNAME_TOKEN && pass != null) {
                pc.setPassword(pass);
                return;
            }
        }
    }

}
