package com.gdssoft.oa.dao.flow.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.ArrayList;
import java.util.List;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.flow.CcuserProcessDao;
import com.gdssoft.oa.model.flow.CcuserProcess;
import com.gdssoft.oa.model.system.AppUser;

@SuppressWarnings("unchecked")
public class CcuserProcessDaoImpl extends BaseDaoImpl<CcuserProcess> implements CcuserProcessDao{

	public CcuserProcessDaoImpl() {
		super(CcuserProcess.class);
	}

	/*
	 * 根据流程ID删除相关数据
	 */
	public void delete(Long runId){
		String strSql = "delete CCUSER_PROCESS where PROCESS_RUN_ID=" + runId;
		jdbcTemplate.execute(strSql);
	}
	
	/*
	 * 更新已读状态
	 */
	public void updateStatus(int userId, int processRunId, int status){
		String strSql = "update CCUSER_PROCESS SET STATUS = "+ status +" WHERE [USER_ID] = "+ userId +" AND PROCESS_RUN_ID = " + processRunId;
		jdbcTemplate.execute(strSql);
	}
	
	@Override
	public List<CcuserProcess> getMyNewCCList(AppUser appUser) {
		System.out.println("getNewCClist---");
		List<CcuserProcess> list=new ArrayList<CcuserProcess>();	
		//ArrayList<Long> paramList = new ArrayList<Long>();
		String hql="select vo from  CcuserProcess  vo, ProcessRun  pr where  pr.runId = vo.processRunId and vo.status<>'1' and  vo.appUser.userId=? "
				+" and pr.runStatus <> 3  order by vo.createDate desc";
		/*
		String sql = "select subject as subjectName,CCUSER_PROCESS.CREATE_DATE as createDate from CCUSER_PROCESS ,process_run " 
				+"where process_run.runId = CCUSER_PROCESS.PROCESS_RUN_ID and CCUSER_PROCESS.Status<>'1' and user_ID="+appUser.getUserId()
				+" order by CCUSER_PROCESS.CREATE_DATE desc";
		return jdbcTemplate.queryForList(sql);*/
		//paramList.add(appUser.getUserId());
		list=findByHql(hql,new Object[] {appUser.getUserId()});
		System.out.println("getNewCClist---:"+list.size());
		return  list;
	}
	
}