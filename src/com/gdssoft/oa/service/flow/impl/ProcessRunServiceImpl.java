package com.gdssoft.oa.service.flow.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import com.gdssoft.core.log.CustomerLog;
import com.gdssoft.oa.dao.flow.TaskDao;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.flow.*;
import com.gdssoft.oa.service.archive.ArchivesService;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.log4j.Logger;
import org.jbpm.api.ProcessInstance;

import com.gdssoft.oa.action.archive.ArchivesAction;
import com.gdssoft.oa.action.flow.FlowRunInfo;
import com.gdssoft.oa.action.flow.ProcessFormReq;
import com.gdssoft.oa.dao.flow.FormDataDao;
import com.gdssoft.oa.dao.flow.ProcessFormDao;
import com.gdssoft.oa.dao.flow.ProcessRunDao;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.core.Constants;
import com.gdssoft.core.jbpm.pv.ParamField;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.paging.PagingBean;

public class ProcessRunServiceImpl extends BaseServiceImpl<ProcessRun> implements ProcessRunService{

	private ProcessRunDao dao;
	@Resource
	private ProcessFormDao processFormDao;
	@Resource
	private FormDataDao formDataDao;
	
	@Resource
	private JbpmService jbpmService;

	@Resource
	private ArchivesService archivesService;

	@Resource
	private TaskDao taskDao;

	private Log logger = LogFactory.getLog(ProcessRunServiceImpl.class);
	public ProcessRunServiceImpl(ProcessRunDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	/**
	 * 按流程的executionId取得流程的运行实例
	 * @param exeId
	 * @return
	 */
	public ProcessRun getByExeId(String exeId){
		ProcessInstance pi=jbpmService.getProcessInstanceByExeId(exeId);
		if(pi!=null){
			return getByPiId(pi.getId());
		}
		return null;
	}
	
	public ProcessRun getByTaskId(String taskId){
		ProcessInstance pi=jbpmService.getProcessInstanceByTaskId(taskId);
		if(pi!=null){
			return getByPiId(pi.getId());
		}
		return null;
	}
	
	public ProcessRun getByPiId(String piId){
		return dao.getByPiId(piId);
	}
	
	/**
	 * 初始化一个新的流程
	 * @return
	 */
	public ProcessRun initNewProcessRun(ProDefinition proDefinition,String archiveSubject){
		
		ProcessRun processRun=new ProcessRun();
		AppUser curUser=ContextUtil.getCurrentUser();
		
		Date curDate=new Date();
		SimpleDateFormat sdf=new SimpleDateFormat("yyyyMMdd-HHmmss");
		if(archiveSubject==null){
		processRun.setSubject(sdf.format(curDate) + "("+curUser.getFullname()+")");
		}
		else{
		processRun.setSubject(archiveSubject);
		}
		processRun.setCreator(curUser.getFullname());
		processRun.setAppUser(curUser);
		processRun.setCreatetime(curDate);
		processRun.setProDefinition(proDefinition);
		
		return processRun;
	}
	
	/**
	 * 初始化子流程
	 * @param proDefinition
	 * @param createUser 子流程发起人
	 * @return
	 */
	public ProcessRun initNewSubProcessRun(ProDefinition proDefinition,AppUser createUser){
		
		ProcessRun processRun=new ProcessRun();
		//AppUser curUser=ContextUtil.getCurrentUser();
		
		Date curDate=new Date();
		SimpleDateFormat sdf=new SimpleDateFormat("yyyyMMdd-HHmmss");
		
		processRun.setSubject(sdf.format(curDate) + "("+createUser.getFullname()+")");
		processRun.setCreator(createUser.getFullname());
		processRun.setAppUser(createUser);
		processRun.setCreatetime(curDate);
		processRun.setProDefinition(proDefinition);
		
		return processRun;
	}

	/**
	 * 流程保存以及启动
	 * @param processRun
	 * @param processForm
	 * @param runInfo
	 */
	public String saveProcessRun(ProcessRun processRun,ProcessForm processForm,FlowRunInfo runInfo){
//		Map variables=new HashMap();
//		
//		//带上启动的流程的信息
//		variables.putAll(runInfo.getVariables());
		
		//保存流程运行的信息
		String runId =String.valueOf(save(processRun).getRunId());
		
		boolean isNewsForm=processForm.getFormId()==null?true:false;
		
		if(isNewsForm){//为新表单的话，则设置当前执行人
			AppUser curUser=ContextUtil.getCurrentUser();
			//设置执行人ID及人名，方便后面查询参与用户
			processForm.setCreatorId(curUser.getUserId());
			processForm.setCreatorName(curUser.getFullname());
		}
		
		//保存流程表单
		processForm.setType(new Long(0));
		processFormDao.save(processForm);
		
		Iterator<String> fieldNames=runInfo.getParamFields().keySet().iterator();
		
		while(fieldNames.hasNext()){
			String fieldName =(String)fieldNames.next();
			ParamField paramField=runInfo.getParamFields().get(fieldName);
			FormData fd=null;
			if(!isNewsForm){
				fd=formDataDao.getByFormIdFieldName(processForm.getFormId(), fieldName);
				fd.copyValue(paramField);
			}else{
				fd=new FormData(paramField);
			}
			fd.setProcessForm(processForm);
			//若后面需要启动流程，则把数据存储在variables
			if(runInfo.isStartFlow()){
				runInfo.getVariables().put(fieldName, fd.getValue());
			}
			//保存流程表单的数据
			formDataDao.save(fd);
		}

		if(runInfo.isStartFlow()){
			//将在启动的流程中携带启动人员的相关信息
			runInfo.getVariables().put(Constants.FLOW_START_USER, ContextUtil.getCurrentUser());
			//设置流程名称
			runInfo.getVariables().put("processName", processRun.getProDefinition().getName());
			//启动流程之后，需要保存流程的实例piId，方便后面的流程跟踪
			String piId=jbpmService.startProcess(processRun.getProDefinition().getDeployId(), runInfo);
			processRun.setRunStatus(ProcessRun.RUN_STATUS_RUNNING);
			processRun.setPiId(piId);
			save(processRun);
		}

		// 流程启动成功，同步更新到archives表的关联id
		if (null != processRun.getArchivesId()
				&& processRun.getArchivesId() > 0) {
			Archives archives = archivesService.get(processRun.getArchivesId());
			archives.setProcessRun(processRun);
			archivesService.save(archives);
		}

		return runId;
		
	}
	
	/**
	 * 流程保存以及启动子流程
	 * @param processRun
	 * @param processForm
	 * @param runInfo
	 */
	public String saveSubProcessRun(ProcessRun processRun,ProcessForm processForm,FlowRunInfo runInfo,AppUser createUser){
//		Map variables=new HashMap();
//		
//		//带上启动的流程的信息
//		variables.putAll(runInfo.getVariables());
		
		Map variables = runInfo.getVariables();
		//保存流程运行的信息
		String runId =String.valueOf(save(processRun).getRunId());
		
		boolean isNewsForm=processForm.getFormId()==null?true:false;
		
		if(isNewsForm){//为新表单的话，则设置当前执行人
			//启动子流程默认属于流程发起人发起，中间的参与者是看不到子流程
			//设置执行人ID及人名，方便后面查询参与用户
			processForm.setCreatorId(createUser.getUserId());
			processForm.setCreatorName(createUser.getFullname());
		}
		
		//保存流程表单
		try {
			processFormDao.save(processForm);
		} catch (Exception e) {
			logger.error("----------processFormDao.save(processForm):"+e);
		}
		
		Iterator<String> fieldNames=runInfo.getParamFields().keySet().iterator();
		
		while(fieldNames.hasNext()){
			String fieldName =(String)fieldNames.next();
			ParamField paramField=runInfo.getParamFields().get(fieldName);
			FormData fd=null;
			if(!isNewsForm){
				fd=formDataDao.getByFormIdFieldName(processForm.getFormId(), fieldName);
				fd.copyValue(paramField);
			}else{
				fd=new FormData(paramField);
			}
			fd.setProcessForm(processForm);
			//若后面需要启动流程，则把数据存储在variables
			if(runInfo.isStartFlow()){
				runInfo.getVariables().put(fieldName, fd.getValue());
			}
			try {
				//保存流程表单的数据
				formDataDao.save(fd);
			} catch (Exception e) {
				logger.error("-----a-----formDataDao.save(fd):"+e);
			}
		}

		if(runInfo.isStartFlow()){
			//将在启动的流程中携带启动人员的相关信息
			runInfo.getVariables().put(Constants.FLOW_START_USER, ContextUtil.getCurrentUser());
			//设置流程名称
			runInfo.getVariables().put("processName", processRun.getProDefinition().getName());
			Map variables2 = runInfo.getVariables();
			//启动流程之后，需要保存流程的实例piId，方便后面的流程跟踪
			String piId=null;
				try {
					piId = jbpmService.startProcess(processRun.getProDefinition().getDeployId(), runInfo);
				} catch (Exception e) {
					logger.error("-----a-----jbpmService.startProcess:"+e);
				}
			processRun.setRunStatus(ProcessRun.RUN_STATUS_RUNNING);
			processRun.setPiId(piId);
			try {
				save(processRun);
			} catch (Exception e) {
				logger.error("-----a-----save(processRun):"+e);
			}
		}
		return runId;
		
	}
	/**
	 * 完成任务，同时把数据保存至form_data表，记录该任务填写的表单数据
	 * @param piId
	 * @param transitionName
	 * @param variables
	 */
	public ProcessInstance saveAndNextStep(FlowRunInfo runInfo){
		ProcessInstance pi;
		if(StringUtils.isNotEmpty(runInfo.getTaskId())){
			pi=jbpmService.getProcessInstanceByTaskId(runInfo.getTaskId());
		}else{
			pi=jbpmService.getProcessInstance(runInfo.getPiId());
		}

		String xml=jbpmService.getDefinitionXmlByPiId(pi.getId());
		
		String nodeType=jbpmService.getNodeType(xml, runInfo.getActivityName());
		
		ProcessRun processRun=getByPiId(pi.getId());

		//取得最大的sn号，也则某一任务被重复驳回时，可以由此查看
		Integer maxSn=processFormDao.getActvityExeTimes(processRun.getRunId(), runInfo.getActivityName()).intValue();
		ProcessForm processForm=new ProcessForm();
		processForm.setActivityName(runInfo.getActivityName());
		processForm.setSn(maxSn+1);
		
		AppUser curUser=ContextUtil.getCurrentUser();
		//设置执行人ID及人名，方便后面查询参与用户
		processForm.setCreatorId(curUser.getUserId());
		processForm.setCreatorName(curUser.getFullname());
		
		processForm.setProcessRun(processRun);
		//保存这些数据至流程运行的环境中
		Map<String,Object>variables=runInfo.getVariables();
		
		Iterator it=runInfo.getParamFields().keySet().iterator();
		
		while(it.hasNext()){
			String key=(String)it.next();
			ParamField paramField=runInfo.getParamFields().get(key);
			FormData fd=new FormData(paramField);
			fd.setProcessForm(processForm);
			//把数据存储在variables
			variables.put(key, fd.getValue());
			processForm.getFormDatas().add(fd);
		}
		//保存数据至表单中，方便后面显示
		ProcessForm processForm2=processFormDao.save(processForm);
		
		//设置当前任务为完成状态，并且为下一任务设置新的执行人或候选人
		if("task".equals(nodeType)){
			//完成此任务，同时为下一任务指定执行人
			return jbpmService.completeTask(runInfo.getTaskId(),runInfo.getTransitionName(),runInfo.getDestName(),runInfo.getVariables(),false,processForm2.getFormId());
		}else{//普通节点
			jbpmService.signalProcess(pi.getId(), runInfo.getTransitionName(), variables); 
			return pi;
		}
	}
	
	/**
	 * 完成任务，同时把数据保存至form_data表，记录该任务填写的表单数据
	 * @param piId
	 * @param transitionName
	 * @param variables
	 */
	public ProcessInstance saveAndNextStep(FlowRunInfo runInfo,ProcessFormReq processFormReq){
		Boolean freeJump=false;
		if(processFormReq.getIsBack()!=null&&"true".equals(processFormReq.getIsBack())){
			freeJump=true;
		}
		ProcessInstance pi;
		if(StringUtils.isNotEmpty(runInfo.getTaskId())){
			pi=jbpmService.getProcessInstanceByTaskId(runInfo.getTaskId());
		}else{
			pi=jbpmService.getProcessInstance(runInfo.getPiId());
		}

		String xml=jbpmService.getDefinitionXmlByPiId(pi.getId());
		
		String nodeType=jbpmService.getNodeType(xml, runInfo.getActivityName());
		
		ProcessRun processRun=getByPiId(pi.getId());

		//取得最大的sn号，也则某一任务被重复驳回时，可以由此查看
		Integer maxSn=processFormDao.getActvityExeTimes(processRun.getRunId(), runInfo.getActivityName()).intValue();
		ProcessForm processForm=new ProcessForm();
		processForm.setActivityName(runInfo.getActivityName());
		processForm.setType(new Long(0));
//		if(processFormReq.getComments()!=null){
//			if(processFormReq.getComments().indexOf("退回")!=-1||processFormReq.toString().indexOf("撤回")!=-1||processFormReq.getComments().indexOf("流程编辑")!=-1){
//				processForm.setActivityName(processFormReq.getComments());
//				processForm.setType(new Long(1));
//			}else{
//				processForm.setActivityName(runInfo.getActivityName());
//				processForm.setType(new Long(0));
//			}
//		}
		if(processFormReq.getStatus()!=null){
			if(processFormReq.getStatus().indexOf("退文")!=-1||processFormReq.getStatus().indexOf("退回")!=-1||processFormReq.getStatus().indexOf("撤回")!=-1||processFormReq.getStatus().indexOf("流程编辑")!=-1){
				if(processFormReq.getStatus().indexOf("特殊处理")!=-1){
					processForm.setActivityName("退回");
				}
				else{
					processForm.setActivityName(processFormReq.getStatus());
				}
				processForm.setType(new Long(1));
			}else{
				processForm.setActivityName(runInfo.getActivityName());
				processForm.setType(new Long(0));
			}
		}
		
		
		processForm.setSn(maxSn+1);
		System.out.println("processFormReq.getStatus()"+processFormReq.getStatus());
		System.out.println("processFormReq.getComments()"+processFormReq.getComments());
		processForm.setStatus(processFormReq.getStatus());
		processForm.setComments(processFormReq.getComments());
		processForm.setIsMobile(processFormReq.getIsMobile());
		
		AppUser curUser=ContextUtil.getCurrentUser();
		//设置执行人ID及人名，方便后面查询参与用户
		processForm.setCreatorId(curUser.getUserId());
		processForm.setCreatorName(curUser.getFullname());
		
		processForm.setProcessRun(processRun);
		//保存这些数据至流程运行的环境中
		Map<String,Object>variables=runInfo.getVariables();
		if(freeJump){
			variables.put("freeJumpUserId", curUser.getUserId());
		}
		if(processFormReq.getStatus()!=null){
			if(processFormReq.getStatus().indexOf("特殊处理")!=-1){
				variables.put("freeJumpType", processFormReq.getStatus());
			}else if(processFormReq.getStatus().indexOf("退文")!=-1||processFormReq.getStatus().indexOf("退回")!=-1){
				variables.put("freeJumpType", "退回");
			}else if(processFormReq.getStatus().indexOf("撤回")!=-1){
				variables.put("freeJumpType", "撤回");
			}else if(processFormReq.getStatus().indexOf("流程编辑")!=-1){
				variables.put("freeJumpType", "流程编辑");
			}
		}
		Iterator it=runInfo.getParamFields().keySet().iterator();
		
		while(it.hasNext()){
			String key=(String)it.next();
			ParamField paramField=runInfo.getParamFields().get(key);
			FormData fd=new FormData(paramField);
			fd.setProcessForm(processForm);
			//把数据存储在variables
			variables.put(key, fd.getValue());
			processForm.getFormDatas().add(fd);
		}
		 
		//保存数据至表单中，方便后面显示
		ProcessForm processForm2=processFormDao.save(processForm);
		 
		//设置当前任务为完成状态，并且为下一任务设置新的执行人或候选人
		if("task".equals(nodeType)){
			//完成此任务，同时为下一任务指定执行人
			return jbpmService.completeTask(runInfo.getTaskId(),runInfo.getTransitionName(),runInfo.getDestName(),runInfo.getVariables(),freeJump,processForm2.getFormId());
		}else{//普通节点
			jbpmService.signalProcess(pi.getId(), runInfo.getTransitionName(), variables); 
			return pi;
		}
	}
	
	
	/**
	 * 会议通知领导批示代处理用
	 * @param piId
	 * @param transitionName
	 * @param variables
	 */
	public ProcessInstance saveAndNextStepForMeeting(FlowRunInfo runInfo,ProcessFormReq processFormReq,String assignee, String assigneeName){
		Boolean freeJump=false;
		if(processFormReq.getIsBack()!=null&&"true".equals(processFormReq.getIsBack())){
			freeJump=true;
		}
		ProcessInstance pi;
		if(StringUtils.isNotEmpty(runInfo.getTaskId())){
			pi=jbpmService.getProcessInstanceByTaskId(runInfo.getTaskId());
		}else{
			pi=jbpmService.getProcessInstance(runInfo.getPiId());
		}

		String xml=jbpmService.getDefinitionXmlByPiId(pi.getId());
		
		String nodeType=jbpmService.getNodeType(xml, runInfo.getActivityName());
		
		ProcessRun processRun=getByPiId(pi.getId());

		//取得最大的sn号，也则某一任务被重复驳回时，可以由此查看
		Integer maxSn=processFormDao.getActvityExeTimes(processRun.getRunId(), runInfo.getActivityName()).intValue();
		ProcessForm processForm=new ProcessForm();
		processForm.setActivityName(runInfo.getActivityName());
		processForm.setType(new Long(0));
//		if(processFormReq.getComments()!=null){
//			if(processFormReq.getComments().indexOf("退回")!=-1||processFormReq.toString().indexOf("撤回")!=-1||processFormReq.getComments().indexOf("流程编辑")!=-1){
//				processForm.setActivityName(processFormReq.getComments());
//				processForm.setType(new Long(1));
//			}else{
//				processForm.setActivityName(runInfo.getActivityName());
//				processForm.setType(new Long(0));
//			}
//		}
		if(processFormReq.getStatus()!=null){
			if(processFormReq.getStatus().indexOf("退文")!=-1||processFormReq.getStatus().indexOf("退回")!=-1||processFormReq.getStatus().indexOf("撤回")!=-1||processFormReq.getStatus().indexOf("流程编辑")!=-1){
				if(processFormReq.getStatus().indexOf("特殊处理")!=-1){
					processForm.setActivityName("退回");
				}
				else{
					processForm.setActivityName(processFormReq.getStatus());
				}
				processForm.setType(new Long(1));
			}else{
				processForm.setActivityName(runInfo.getActivityName());
				processForm.setType(new Long(0));
			}
		}
		
		
		processForm.setSn(maxSn+1);
		System.out.println("processFormReq.getStatus()"+processFormReq.getStatus());
		System.out.println("processFormReq.getComments()"+processFormReq.getComments());
		processForm.setStatus(processFormReq.getStatus());
		processForm.setComments(processFormReq.getComments());
		processForm.setIsMobile(processFormReq.getIsMobile());
		
		AppUser curUser=ContextUtil.getCurrentUser();
		//设置执行人ID及人名，方便后面查询参与用户
		processForm.setCreatorId(Long.parseLong(assignee));
		processForm.setCreatorName(assigneeName);
		
		processForm.setProcessRun(processRun);
		//保存这些数据至流程运行的环境中
		Map<String,Object>variables=runInfo.getVariables();
		if(freeJump){
			variables.put("freeJumpUserId", curUser.getUserId());
		}
		if(processFormReq.getStatus()!=null){
			if(processFormReq.getStatus().indexOf("特殊处理")!=-1){
				variables.put("freeJumpType", processFormReq.getStatus());
			}else if(processFormReq.getStatus().indexOf("退文")!=-1||processFormReq.getStatus().indexOf("退回")!=-1){
				variables.put("freeJumpType", "退回");
			}else if(processFormReq.getStatus().indexOf("撤回")!=-1){
				variables.put("freeJumpType", "撤回");
			}else if(processFormReq.getStatus().indexOf("流程编辑")!=-1){
				variables.put("freeJumpType", "流程编辑");
			}
		}
		Iterator it=runInfo.getParamFields().keySet().iterator();
		
		while(it.hasNext()){
			String key=(String)it.next();
			ParamField paramField=runInfo.getParamFields().get(key);
			FormData fd=new FormData(paramField);
			fd.setProcessForm(processForm);
			//把数据存储在variables
			variables.put(key, fd.getValue());
			processForm.getFormDatas().add(fd);
		}
		 
		//保存数据至表单中，方便后面显示
		ProcessForm processForm2=processFormDao.save(processForm);
		 
		//设置当前任务为完成状态，并且为下一任务设置新的执行人或候选人
		if("task".equals(nodeType)){
			//完成此任务，同时为下一任务指定执行人
			return jbpmService.completeTask(runInfo.getTaskId(),runInfo.getTransitionName(),runInfo.getDestName(),runInfo.getVariables(),freeJump,processForm2.getFormId());
		}else{//普通节点
			jbpmService.signalProcess(pi.getId(), runInfo.getTransitionName(), variables); 
			return pi;
		}
	}
	
	/**
	 * 移除该流程的运行，前提是该流程尚未启动
	 */
	public void remove(Long runId) {
		ProcessRun processRun=dao.get(runId);
		if(ProcessRun.RUN_STATUS_INIT.equals(processRun.getRunStatus())){
			List<ProcessForm> processForms=processFormDao.getByRunId(runId);
			for(ProcessForm processForm:processForms){
				processFormDao.remove(processForm);
			}
		}
		dao.remove(processRun);
	}
	
	/**
	 * 删除某一流程的所有实例
	 * @param defId 流程定义的Id，则表pro_defintion的defId
	 */
	public void removeByDefId(Long defId){
		//按分页查询所有实例表单
		List<ProcessRun> processRunList=dao.getByDefId(defId, new PagingBean(0, 25));
		for(int i=0;i<processRunList.size();i++){
			dao.remove(processRunList.get(i));
		}
		
		if(processRunList.size()==25){
			removeByDefId(defId);
		}
	}
	
	/**
	 * 按标题模糊查询某个用户所参与的流程列表
	 * @param userId
	 * @param processName
	 * @param pb
	 * @return
	 */
	public List<ProcessRun> getByUserIdSubject(Long userId,String subject,PagingBean pb){
		return dao.getByUserIdSubject(userId, subject, pb);
	}
	
	/**
	 * 终止流程
	 * @param processRun
	 */
	public void stopProcessRun(ProcessRun processRun){
		save(processRun);
	}

	@Override
	public ProcessRun getByPiIdAndSchema(String schema, String piId) {
		return dao.getByPiIdAndSchema(schema, piId);
	}
	
	public void initJbpmDbid() {
		jbpmService.initJbpmDbid();
	}

	@Override
	public JbpmTask getByTaskId(Long taskId) {
		return taskDao.getByTaskId(taskId);
	}

	@Override
	public List<JbpmTask> getProTasksByTaskId(Long taskId) {
		return taskDao.getProTasksByTaskId(taskId);
	}
    
    public List<Department> getDeptByUserIds(String userIds){
    	 return taskDao.getDeptByUserIds(userIds);
    }
    
	public List<JbpmTask> getLeaderForMeetingTaskByPiid(String piid) {
		return taskDao.getLeaderForMeetingTaskByPiid(piid);
	}
}
