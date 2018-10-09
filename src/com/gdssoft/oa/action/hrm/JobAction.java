package com.gdssoft.oa.action.hrm;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import java.lang.reflect.Type;

import com.gdssoft.oa.model.hrm.EmpProfile;
import com.gdssoft.oa.model.hrm.Job;
import com.gdssoft.oa.service.hrm.JobService;
import com.google.gson.Gson;
import com.google.gson.JsonSerializer;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;



import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class JobAction extends BaseAction{
	@Resource
	private JobService jobService;
	private Job job;
	
	private Long jobId;

	public Long getJobId() {
		return jobId;
	}

	public void setJobId(Long jobId) {
		this.jobId = jobId;
	}

	public Job getJob() {
		return job;
	}

	public void setJob(Job job) {
		this.job = job;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<Job> list= jobService.getAll(filter);
		
//		Type type=new TypeToken<List<Job>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
//		Gson gson=new Gson();
		JSONSerializer serializer=new JSONSerializer();
		buff.append(serializer.exclude(new String[]{"class","department.appUser"}).serialize(list));
//		buff.append(gson.toJson(list, type));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				Job removeJob = jobService.get(new Long(id));
				removeJob.setDelFlag(Job.DELFLAG_HAD);
				jobService.save(removeJob);
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		Job job=jobService.get(jobId);
		
		//Gson gson=new Gson();
		JSONSerializer json = new JSONSerializer();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(json.exclude(new String[]{"class"}).serialize(job));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		job.setDelFlag(Job.DELFLAG_NOT);
		jobService.save(job);
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	/**
	 * 下拉选择
	 *根据部门来选择
	 */
	public String combo(){
		String strDepId=getRequest().getParameter("depId");
		if(StringUtils.isNotEmpty(strDepId)){
		  List<Job> list=jobService.findByDep(new Long(strDepId));
		  StringBuffer sb=new StringBuffer("[");
		  for(Job job:list){
			  sb.append("['").append(job.getJobId()).append("','").append(job.getJobName()).append("'],");
		  }
		  if(list.size()>0){
			  sb.deleteCharAt(sb.length()-1);
		  }
		  sb.append("]");
		  setJsonString(sb.toString());
		}else{
			setJsonString("{success:false}");
		}
		return SUCCESS;
	}
	
	/**
	 * 恢复职位
	 * @return
	 */
	public String recovery(){
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				Job deleteJob = jobService.get(new Long(id));
				deleteJob.setDelFlag(Job.DELFLAG_NOT);
				jobService.save(deleteJob);
			}
		}
		jsonString="{success:true}";
		return SUCCESS;
	}
}
