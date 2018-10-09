package com.gdssoft.oa.dao.flow;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import org.jbpm.pvm.internal.task.TaskImpl;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.jbpm.pv.TaskInfo;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.flow.JbpmTask;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;

public interface TaskDao extends BaseDao<TaskImpl>{
	public void init();
	public List<TaskImpl> getTasksByUserId(String userId,PagingBean pb);
	public TaskImpl getTasks(String piId);
	/**
	 * 通过活动名称及参数Key取得某任务列表
	 * @param activityName
	 * @param varKey
	 * @return
	 */
	public List<JbpmTask> getByActivityNameVarKeyLongVal(String activityName,String varKey,Long value);
	/**
	 * 通过任务ID来查找任务人员组的角色ID
	 * @param taskId
	 * @return
	 */
	public List<Long> getGroupByTask(Long taskId);
	/**
	 * 通过任务的ID来查找子任务的执行人员ID
	 * @param taskId
	 * @return
	 */
	public List<Long> getUserIdByTask(Long taskId);
	
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
	/**
	 * 根据用户ID从存储过程
	 * @param userId 用户ID
	 * @param pb 分页数据
	 * @param createDateSort 创建时间排序
	 * @param urgentDateSort 紧急程度排序
	 * @return
	 */
	public List<TaskInfo> getTasksByUserIdFromView(String userId,String flowAssignIds,PagingBean pb,String createDateSort,String urgentDateSort);
	
	public List<TaskInfo> getTasksByUserFromView(AppUser appUser, String flowAssignIds,PagingBean pb,String createDateSort,String urgentDateSort);

	/**
	 * 获取当前任务
	 *
	 * @param taskId
	 * @return
	 */
	public JbpmTask getByTaskId(Long taskId);

	/**
	 * 获取当前任务所在流程的所有任务
	 *
	 * @param taskId
	 * @return
	 */
	public List<JbpmTask> getProTasksByTaskId(Long taskId);
	public List<Department> getDeptByUserIds(String userIds);
	
    /**
     * 获取会议通知当前流程的所有领导批示任务
     * */
    public List<JbpmTask> getLeaderForMeetingTaskByPiid(String piid);
}
