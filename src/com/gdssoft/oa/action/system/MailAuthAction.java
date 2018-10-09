package com.gdssoft.oa.action.system;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/

import javax.annotation.Resource;

import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.service.point.MailAuthService;
/**
 * 
 * @author csx
 *
 */
public class MailAuthAction extends BaseAction{
	@Resource
	private MailAuthService mailAuthService;
	
	@Override
	public String execute() throws Exception {
		String addr = ContextUtil.getCurrentUser().getEmail();
		setJsonString("{success:true,addr:'"+addr+"',key:\'"+mailAuthService.createAuthKey(addr)+"\'}");
		return SUCCESS;
	}
	
}
