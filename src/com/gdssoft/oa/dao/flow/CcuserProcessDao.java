package com.gdssoft.oa.dao.flow;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.flow.CcuserProcess;
import com.gdssoft.oa.model.system.AppUser;

/**
 * 
 * @author 
 *
 */
public interface CcuserProcessDao extends BaseDao<CcuserProcess>{
	/*
	 * 根据流程ID删除相关数据
	 */
	void delete(Long runId);
	
	/*
	 * 更新已读状态
	 */
	void updateStatus(int userId, int processRunId, int status);

	List<CcuserProcess> getMyNewCCList(AppUser appUser);
}