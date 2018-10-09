package com.gdssoft.oa.service.flow.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.jbpm.pvm.internal.task.TaskImpl;

import com.gdssoft.core.jbpm.pv.TaskInfo;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.flow.TaskDao;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.flow.JbpmTask;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.model.system.UserAgent;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.flow.TaskService;
import com.gdssoft.oa.service.point.MyToDoListService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.SysConfigService;
import com.gdssoft.oa.service.system.UserAgentService;

public class TaskServiceImpl extends BaseServiceImpl<TaskImpl> implements TaskService{

	@Resource
	private ProcessRunService processRunService;
	@Resource
	private  SysConfigService sysConfigService;
	@Resource
	private MyToDoListService myToDoListService;
	@Resource
	private UserAgentService userAgentService;
	@Resource
	private ArchivesService archivesService;
	private TaskDao dao;
	public TaskServiceImpl(TaskDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Resource
	private AppUserService appUserService;
	public void init(){
		dao.init();
	}
	public List<TaskImpl> getTasksByUserId(String userId,PagingBean pb){
		return dao.getTasksByUserId(userId,pb);
	}
	
	/**
	 * 显示自定义的任务信息
	 */
	public List<TaskInfo> getTaskInfosByUserId(String userId,PagingBean pb){
		List<TaskImpl> list=getTasksByUserId(userId, pb);
		List<TaskInfo> taskInfoList=new ArrayList<TaskInfo>();
		for(TaskImpl taskImpl:list){
			TaskInfo taskInfo=new TaskInfo(taskImpl);
			if(taskImpl.getAssignee()!=null){
				AppUser user=appUserService.get(new Long(taskImpl.getAssignee()));
				taskInfo.setAssignee(user.getFullname());
			}
			ProcessRun processRun=processRunService.getByPiId(taskInfo.getPdId());
			if(processRun!=null){				
				taskInfo.setTaskName(processRun.getProDefinition().getName() + "--" + taskImpl.getActivityName());
				taskInfo.setActivityName(taskImpl.getActivityName());
			}
			//显示任务，需要加上流程的名称
			taskInfoList.add(taskInfo);
		}
		return taskInfoList;
	}

	
	@Override
	public Set<Long> getHastenByActivityNameVarKeyLongVal(String activityName,
			String varKey, Long value) {
		List<JbpmTask> jtasks=dao.getByActivityNameVarKeyLongVal(activityName, varKey, value);
		Set<Long> userIds=new HashSet<Long>();
		for(JbpmTask jtask:jtasks){
			if(jtask.getAssignee()==null){
				List<Long> userlist=dao.getUserIdByTask(jtask.getTaskId());
				userIds.addAll(userlist);
				List<Long> groupList=dao.getGroupByTask(jtask.getTaskId());
				for(Long l:groupList){
					List<AppUser> uList=appUserService.findByRoleId(l);
					List<Long> idList=new ArrayList<Long>();
					for(AppUser appUser:uList){
						idList.add(appUser.getUserId());
					}
					userIds.addAll(idList);
				}
			}else{
				userIds.add(new Long(jtask.getAssignee()));
			}
		}
		return userIds;
	}
	@Override
	public List<TaskImpl> getCandidateTasks(String userId, PagingBean pb) {
		return dao.getCandidateTasks(userId, pb);
	}
	
	@Override
	public List<TaskImpl> getPersonTasks(String userId, PagingBean pb) {
		return dao.getPersonTasks(userId, pb);
	}

	@Override

	/**
	 * 显示用于手机获取待审批公文的的任务信息
	 */
	public List<TaskInfo> getTaskInfosForFileByUserId(String userId,PagingBean pb){
		/*List<TaskImpl> list = getTasksByUserId(userId, pb);
		List<TaskInfo> taskInfoList=new ArrayList<TaskInfo>();
		List<SysConfig> sysConfList=sysConfigService.findDataByTypeKey("flowIDConfig");
		for(TaskImpl taskImpl:list){
			TaskInfo taskInfo=new TaskInfo(taskImpl);
			if(taskImpl.getAssignee()!=null){
				AppUser user=appUserService.get(new Long(taskImpl.getAssignee()));
				taskInfo.setAssignee(user.getFullname());
			}
			ProcessRun processRun=processRunService.getByPiId(taskInfo.getPdId());
			if(processRun!=null){
			
				//SysConfig sysConfig1=sysConfigService.findDataValueByTkCkey("flowIDConfig", "innerFileFlowID");
				
				for(int i=0;i<sysConfList.size();i++){
					Long longData=new Long( sysConfList.get(i).getDataValue());
					
					if(( processRun.getProDefinition().getTypeId().equals(longData))||(processRun.getProDefinition().getTypeId()==longData)){
						
						//taskInfo.setTaskName(processRun.getProDefinition().getName() + "--" + taskImpl.getActivityName());
						taskInfo.setTaskName(processRun.getSubject()); //update by hejianghai 20110823
						taskInfo.setActivityName(taskImpl.getActivityName());
						//显示任务，需要加上流程的名称
						if(processRun.getProDefinition().getName().equals("督办申请") || processRun.getProDefinition().getName().equals("归档申请") || processRun.getProDefinition().getName().equals("用印申请流程")){
							continue;
						}else{
							taskInfoList.add(taskInfo);	
						}
					}
					
				}
					}
			
		}
		return taskInfoList;*/
		
		//查询当前登录用户是否有被设置为代办人
		List<UserAgent> userAgentList = userAgentService.getByGrantUId(Long.valueOf(userId));
		//定义包含自己的id和被代理人的id字符串
		String flowAssignIds = "";
		StringBuilder sb = new  StringBuilder();
		sb.append("''"+userId.toString()+"''").append(",");
		for(UserAgent ua:userAgentList){
			sb.append("''"+ua.getUserId().toString()+"''").append(",");
		}
		flowAssignIds = sb.toString().substring(0,
				sb.toString().length() - 1);
		
		// TODO Auto-generated method stub
		List<TaskInfo> taskInfoList=dao.getTasksByUserIdFromView(userId,flowAssignIds,pb,null,null);
		List<TaskInfo> taskInfoList2=new ArrayList<TaskInfo>();
		
		List<SysConfig> sysConfList = sysConfigService.findDataByTypeKey("flowIDConfig");
		
		for(TaskInfo taskInfo:taskInfoList){
			
			if(taskInfo.getAssignee()!=null && !"".equals(taskInfo.getAssignee())){
				AppUser user=appUserService.get(new Long(taskInfo.getAssignee()));
				taskInfo.setAssignee(user.getFullname());
			}
			if(taskInfo.getPdId()!=null && !"".equals(taskInfo.getPdId())){
				ProcessRun processRun=processRunService.getByPiId(taskInfo.getPdId());
				if(processRun!=null){					
					for(int i=0;i<sysConfList.size();i++){
						Long longData=new Long( sysConfList.get(i).getDataValue());
						
						if(( processRun.getProDefinition().getTypeId().equals(longData))||(processRun.getProDefinition().getTypeId()==longData)){
							//显示任务，需要加上流程的名称
							taskInfo.setTaskName(processRun.getSubject()); //update by hejianghai 20110823
							taskInfo.setActivityName(taskInfo.getActivityName());
							//过滤只需要公文
							if(processRun.getProDefinition().getName().equals("督办申请") || processRun.getProDefinition().getName().equals("归档申请") || processRun.getProDefinition().getName().equals("用印申请流程")){
								continue;
							}else{
								taskInfoList2.add(taskInfo);	
							}
						}
					}
				}
			}			
		}
		return taskInfoList2;
	}
	
	
	@Override
	public List<TaskInfo> getTasksByUserIdFromView(String userId,PagingBean pb,String createDateSort,String urgentDateSort) {
		//查询当前登录用户是否有被设置为代办人
		List<UserAgent> userAgentList = userAgentService.getByGrantUId(Long.valueOf(userId));
		//定义包含自己的id和被代理人的id字符串
		String flowAssignIds = "";
		StringBuilder sb = new  StringBuilder();
		sb.append("''"+userId.toString()+"''").append(",");
		for(UserAgent ua:userAgentList){
			sb.append("''"+ua.getUserId().toString()+"''").append(",");
		}
		flowAssignIds = sb.toString().substring(0,
				sb.toString().length() - 1);
		
		// TODO Auto-generated method stub
		List<TaskInfo> taskInfoList=dao.getTasksByUserIdFromView(userId,flowAssignIds,pb,createDateSort,urgentDateSort);
		List<TaskInfo> taskInfoList2=new ArrayList<TaskInfo>();
		for(TaskInfo taskInfo:taskInfoList){
			
			if(taskInfo.getAssignee()!=null && !"".equals(taskInfo.getAssignee())){
				AppUser user=appUserService.get(new Long(taskInfo.getAssignee()));
				taskInfo.setAssignee(user.getFullname());
			}
			if(taskInfo.getPdId()!=null && !"".equals(taskInfo.getPdId())){
				ProcessRun processRun = null;
				if(taskInfo.getPdId().split("[.]").length > 2){
				     String[] taskInfos= taskInfo.getPdId().split("[.]");
				     processRun = processRunService.getByPiId(taskInfos[0]+"."+taskInfos[1]);
				}else{
					processRun =processRunService.getByPiId(taskInfo.getPdId());
				}
				
				if(processRun!=null){
					Archives archives = archivesService.getArchivesByRunId(processRun.getRunId());
					if (archives != null && !archives.equals("")) {
						if (archives.getArchType() != null
								&& !archives.getArchType().equals("")) {
							taskInfo.setArchivesType(archives.getArchType());
						} else {
							taskInfo.setArchivesType(null);
						}
					}else{
						taskInfo.setArchivesType(null);
					}
					// taskInfo.setTaskName(processRun.getProDefinition().getName() + "--" + taskInfo.getActivityName());
					taskInfo.setTaskName(processRun.getProDefinition().getName() + "--" + processRun.getSubject());
					taskInfo.setActivityName(taskInfo.getActivityName());
				}
			}
			
			
			//显示任务，需要加上流程的名称
			taskInfoList2.add(taskInfo);
		}
		return taskInfoList2;
	}

	@Override
	public List<TaskInfo> getTasksByUserFromView(AppUser appUser,
			PagingBean pb, String createDateSort, String urgentDateSort) {
		List<UserAgent> userAgentList = userAgentService.getByGrantUIdAndSchema(appUser.getOwnerSchema(), appUser.getUserId());
		String flowAssignIds = "";
		StringBuilder sb = new  StringBuilder();
		sb.append("''"+appUser.getUserId().toString()+"''").append(",");
		for(UserAgent ua:userAgentList){
			sb.append("''"+ua.getUserId().toString()+"''").append(",");
		}
		flowAssignIds = sb.toString().substring(0,
				sb.toString().length() - 1);
		List<TaskInfo> taskInfoList = dao.getTasksByUserFromView(appUser, flowAssignIds, pb, createDateSort, urgentDateSort);
		List<TaskInfo> taskInfoList2=new ArrayList<TaskInfo>();
		for(TaskInfo taskInfo:taskInfoList){
			if(taskInfo.getAssignee()!=null && !"".equals(taskInfo.getAssignee())){
				AppUser user = appUserService.findByIdAndSchema(appUser.getOwnerSchema(), new Long(taskInfo.getAssignee()));
				taskInfo.setAssignee(user.getFullname());
			}
			if(taskInfo.getPdId()!=null && !"".equals(taskInfo.getPdId())){
				ProcessRun processRun = null;
				if(taskInfo.getPdId().split("[.]").length > 2){
					processRun = processRunService.getByPiIdAndSchema(appUser.getOwnerSchema(), taskInfo.getPdId().substring(0, taskInfo.getPdId().lastIndexOf(".")));
				}else{
					processRun =processRunService.getByPiIdAndSchema(appUser.getOwnerSchema(), taskInfo.getPdId());
				}
				if(processRun!=null){
					Archives archives = archivesService.getArchivesByRunIdAndSchema(appUser.getOwnerSchema(), processRun.getRunId());
					if (archives != null && !archives.equals("")) {
						if (archives.getArchType() != null
								&& !archives.getArchType().equals("")) {
							taskInfo.setArchivesType(archives.getArchType());
						} else {
							taskInfo.setArchivesType(null);
						}
					}else{
						taskInfo.setArchivesType(null);
					}
					// taskInfo.setTaskName(processRun.getProDefinition().getName() + "--" + taskInfo.getActivityName());
					taskInfo.setTaskName(processRun.getProDefinition().getName() + "--" + processRun.getSubject());
					taskInfo.setActivityName(taskInfo.getActivityName());
				}
			}
			taskInfoList2.add(taskInfo);
		}
		return taskInfoList2;
	}


}
