package com.gdssoft.oa.service.flow.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.flow.CcuserProcessDao;
import com.gdssoft.oa.model.flow.CcuserProcess;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.flow.CcuserProcessService;

public class CcuserProcessServiceImpl extends BaseServiceImpl<CcuserProcess> implements CcuserProcessService{
	private CcuserProcessDao dao;
	
	public CcuserProcessServiceImpl(CcuserProcessDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	/*
	 * 根据流程ID删除相关数据
	 */
	public void delete(Long runId){
		this.dao.delete(runId);
	}
	
	/*
	 * 更新已读状态
	 */
	public void updateStatus(int userId, int processRunId, int status){
		this.dao.updateStatus(userId, processRunId, status);
	}

	@Override
	public List<CcuserProcess> getMyNewCCList(AppUser appUser) {
		return this.dao.getMyNewCCList(appUser);
	}
}