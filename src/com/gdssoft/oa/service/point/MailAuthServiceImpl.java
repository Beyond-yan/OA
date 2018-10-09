package com.gdssoft.oa.service.point;

import java.util.HashMap;
import java.util.Map;

import javax.jws.WebService;

import com.gdssoft.core.util.UUIDGenerator;


/**
 * 待办集成
 * @author shizenghua
 */
@WebService(endpointInterface = "com.gdssoft.oa.service.point.MailAuthService", targetNamespace = "http://point.service.oa.gdssoft.com/")
public class MailAuthServiceImpl implements MailAuthService{
	
	private static Map<String,String> keys = new HashMap<String,String>();
	
	@Override
	public String createAuthKey(String address) {
		if(address!=null){
			String key = UUIDGenerator.getUUID();
			keys.put(address,key );
			return key;
		}
		return null;
	}

	@Override
	public int authCheck(String address, String authkey) {
		String key = keys.get(address);
		if(authkey != null && authkey.equals(key)){
			keys.remove(address);
			return 1;
		}else{	//若验证失败，直到下次验证通过才会从缓存中清除
			return -1;
		}
	}


	
}
