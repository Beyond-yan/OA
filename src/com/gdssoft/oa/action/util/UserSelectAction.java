package com.gdssoft.oa.action.util;

import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.oa.model.flow.JbpmTask;
import org.apache.commons.lang.StringUtils;
import org.jbpm.api.task.Task;
import org.jbpm.pvm.internal.task.TaskImpl;

import com.gdssoft.core.util.StringUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.system.AppUserService;

public class UserSelectAction extends BaseAction {
	@Resource
	private ProcessRunService processRunService;
	@Resource
	private JbpmService jbpmService;
	@Resource
	private AppUserService appUserService;
	
	/**
	 * 查询某个人员在某一流程是否正在办理某一任务
	 * @return
	 */
	public String getWaitingUser(){
		String taskId=getRequest().getParameter("taskId");//流程ID
		String userId=getRequest().getParameter("userIds");//用户ID，一个或者多个
		String waitUser="";
		if (StringUtils.isEmpty(taskId)) {
			setJsonString(waitUser);
			return SUCCESS;
		}
		List<JbpmTask> tasks = null;
		try {
			tasks = processRunService.getProTasksByTaskId(Long.valueOf(taskId));
		} catch (Exception e) {

		}
		if (tasks == null || tasks.size() <= 0) {
			setJsonString(waitUser);
			return SUCCESS;
		}
		for (JbpmTask task : tasks) {
			if (userId.indexOf(task.getAssignee()) >= 0
					&& !StringUtils.equals(String.valueOf(ContextUtil.getCurrentUser().getUserId()), task.getAssignee())) {
				waitUser += task.getAssigneeName() + ",";
			}
		}
		if (StringUtils.isNotEmpty(waitUser)) {
			waitUser = waitUser.substring(0, waitUser.length() - 1);
		}
//		userId=","+userId+",";
//		ProcessRun processRun=processRunService.getByTaskId(taskId);
//		String piId=processRun.getPiId();
//		List<Task> taskList=jbpmService.getTasksByPiId(piId);
//		String waitUser="";
//		for (int i=0;i<taskList.size();i++) {
//			Task task=taskList.get(i);
//			TaskImpl taskImpl = (TaskImpl) task;
//			if(taskImpl.getSuperTask()==null && taskImpl.getSubTasks().size()!=0){
//				for(Task taskTemp:taskImpl.getSubTasks()){
//					if (userId.indexOf(","+taskTemp.getAssignee()+",")>-1&&!taskId.equals(taskImpl.getId())) {
//						AppUser appUser = appUserService.get(Long.valueOf(taskTemp.getAssignee()));
//						waitUser+=appUser.getFullname()+",";
//					}
//				}
//			}else if (StringUtil.isNum(taskImpl.getAssignee())) {
//				if (userId.indexOf(","+taskImpl.getAssignee()+",")>-1&&!taskId.equals(taskImpl.getId())) {
//					AppUser appUser=appUserService.get(new Long(taskImpl.getAssignee()));
//					waitUser+=appUser.getFullname()+",";
//				}
//			}
//		}
//		if(waitUser.length()>0)waitUser=waitUser.substring(0,waitUser.length()-1);
		setJsonString(waitUser);
		return SUCCESS;
	}
}
