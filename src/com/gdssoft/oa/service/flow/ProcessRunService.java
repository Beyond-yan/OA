package com.gdssoft.oa.service.flow;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.model.flow.JbpmTask;

import org.jbpm.api.ProcessInstance;

import com.gdssoft.oa.action.flow.FlowRunInfo;
import com.gdssoft.oa.action.flow.ProcessFormReq;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.model.flow.ProcessForm;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;


public interface ProcessRunService extends BaseService<ProcessRun>{
	
	public ProcessRun initNewProcessRun(ProDefinition proDefinition, String archivesSubject);
	
	/**
	 * 流程保存以及启动
	 * @param processRun
	 * @param processForm
	 * @param runInfo
	 */
	public String saveProcessRun(ProcessRun processRun,ProcessForm processForm,FlowRunInfo runInfo);
	
	/**
	 * 流程保存以及启动子流程
	 * @param processRun
	 * @param processForm
	 * @param runInfo
	 * add by lxw
	 */
	public String saveSubProcessRun(ProcessRun processRun,ProcessForm processForm,FlowRunInfo runInfo,AppUser createUser);
	
	
	/**
	 * 按流程的executionId取得流程的运行实例
	 * @param exeId
	 * @return
	 */
	public ProcessRun getByExeId(String exeId);
	
	/**
	 * 按任务TaskId取得流程的运行实例
	 * @param taskId
	 * @return
	 */
	public ProcessRun getByTaskId(String taskId);
	/**
	 * 
	 * @param piId
	 * @return
	 */
	public ProcessRun getByPiId(String piId);
	
	/**
	 * 完成任务，同时把数据保存至form_data表，记录该任务填写的表单数据
	 * @param piId
	 * @param transitionName
	 * @param variables
	 */
	public ProcessInstance saveAndNextStep(FlowRunInfo runInfo);
	/**
	 * 完成任务，同时把数据保存至form_data表，记录该任务填写的表单数据,把流程表单的审批结果和审批意见存储至process_form表
	 * @param piId
	 * @param transitionName
	 * @param ProcessFormReq 封装审批结果和审批意见
	 * @param variables
	 */
	public ProcessInstance saveAndNextStep(FlowRunInfo runInfo,ProcessFormReq processFormReq);

	/**
	 * 会议通知代处理完成任务
	 * @param runInfo
	 * @param processFormReq
	 * @return
	 */
	public ProcessInstance saveAndNextStepForMeeting(FlowRunInfo runInfo,ProcessFormReq processFormReq,String asignee, String asigneeName);

	
	/**
	 * 删除某一流程的所有实例
	 * @param defId 流程定义的Id，则表pro_defintion的defId
	 */
	public void removeByDefId(Long defId);
	
	/**
	 * 按标题模糊查询某个用户所参与的流程列表
	 * @param userId
	 * @param processName
	 * @param pb
	 * @return
	 */
	public List<ProcessRun> getByUserIdSubject(Long userId,String subject,PagingBean pb);
	
	/**
	 * 终止流程
	 * @param processRun
	 */
	public void stopProcessRun(ProcessRun processRun);
	
	/**
	 * 初始化子流程
	 * @param proDefinition
	 * @param createUser 子流程发起人
	 * @return
	 */
	public ProcessRun initNewSubProcessRun(ProDefinition proDefinition,AppUser createUser);
	
	public ProcessRun getByPiIdAndSchema(String schema, String piId);
	
	public void initJbpmDbid();

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


