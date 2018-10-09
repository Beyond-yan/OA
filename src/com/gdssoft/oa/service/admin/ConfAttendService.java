package com.gdssoft.oa.service.admin;
/*
 *   捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.model.admin.ConfAttend;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.core.service.BaseService;

public interface ConfAttendService extends BaseService<ConfAttend>{
	
	public List<ConfAttend> getConfAt(Long confID);

	/**
	 * 从userIds中过滤出领导
	 * @param leaderId
	 * @return
	 */
	public List<AppUser> fliterLeader(String userIds);
	
	public void delete(Long confId);
	
	
}


