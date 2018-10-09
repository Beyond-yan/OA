package com.gdssoft.oa.service.point;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import javax.jws.WebMethod;
import javax.jws.WebService;

import com.gdssoft.oa.model.system.AppUser;

/**
 * 
 * 待办集成
 * 
 * @author shizenghua
 * 
 */
@WebService
public interface MailAuthService {

	public String createAuthKey(String address);
	
	@WebMethod(operationName="auth_check")
	public int authCheck(String address, String authkey);
}
