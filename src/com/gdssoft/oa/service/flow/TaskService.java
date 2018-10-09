package com.gdssoft.oa.service.flow;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/

import java.util.List;
import java.util.Set;

import org.jbpm.pvm.internal.task.TaskImpl;

import com.gdssoft.core.jbpm.pv.TaskInfo;
import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.system.AppUser;

public interface TaskService extends BaseService<TaskImpl>{
	public void init();
	/**
	 * 取得用户的对应的任务列表
	 * @param userId
	 * @return
	 */
	public List<TaskImpl> getTasksByUserId(String userId,PagingBean pb);
	
	/**
	 * 
	 * @param userId
	 * @param pb
	 * @return
	 */
	public List<TaskInfo> getTaskInfosByUserId(String userId,PagingBean pb);
	/**
	 * 根据活动名称及参数Key取得参与人Id
	 * @param activityName
	 * @param varKey
	 * @param value
	 * @return
	 */
	public Set<Long> getHastenByActivityNameVarKeyLongVal(String activityName,String varKey,Long value);
	
	
	/**
	 * 取得某个用户候选的任务列表
	 * @param userId
	 * @param pb
	 * @return
	 */
	public List<TaskImpl> getCandidateTasks(String userId,PagingBean pb);
	
	/**
	 * 查找个人归属任务，不包括其角色归属的任务
	 * @param userId
	 * @param pb
	 * @return
	 */
	public List<TaskImpl> getPersonTasks(String userId,PagingBean pb);
	public List<TaskInfo> getTaskInfosForFileByUserId(String userId,PagingBean pb);
	/**
	 * 根据用户ID从存储过程
	 * @param userId 用户ID
	 * @param pb 分页数据
	 * @param createDateSort 创建时间排序
	 * @param urgentDateSort 紧急程度排序
	 * @return
	 */
	public List<TaskInfo> getTasksByUserIdFromView(String userId,PagingBean pb,String createDateSort,String urgentDateSort);
	
	public List<TaskInfo> getTasksByUserFromView(AppUser appUser, PagingBean pb,String createDateSort,String urgentDateSort);
}
