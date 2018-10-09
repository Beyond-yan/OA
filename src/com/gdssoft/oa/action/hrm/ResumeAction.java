package com.gdssoft.oa.action.hrm;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.Date;
import java.util.List;
import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import java.lang.reflect.Type;

import com.gdssoft.oa.model.hrm.Resume;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.service.hrm.ResumeService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;


/**
 * 
 * @author 
 *
 */
public class ResumeAction extends BaseAction{
	@Resource
	private ResumeService resumeService;
	private Resume resume;
	@Resource
	private FileAttachService fileAttachService; 
	
	private Long resumeId;

	public Long getResumeId() {
		return resumeId;
	}

	public void setResumeId(Long resumeId) {
		this.resumeId = resumeId;
	}

	public Resume getResume() {
		return resume;
	}

	public void setResume(Resume resume) {
		this.resume = resume;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<Resume> list= resumeService.getAll(filter);
		
		Type type=new TypeToken<List<Resume>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
		buff.append(gson.toJson(list, type));
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
				resumeService.remove(new Long(id));
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
		Resume resume=resumeService.get(resumeId);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:[");
		sb.append(gson.toJson(resume));
		sb.append("]}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		String fileIds=getRequest().getParameter("fileIds");
		if(resume.getResumeId()==null){
			AppUser appUser=ContextUtil.getCurrentUser();
			resume.setRegistor(appUser.getFullname());
			resume.setRegTime(new Date());
		}
		if(StringUtils.isNotEmpty(fileIds)){
			resume.getResumeFiles().clear();
			String[] ids=fileIds.split(",");
			for(int i=0;i<ids.length;i++){
			   FileAttach fileAttach=fileAttachService.get(new Long(ids[i]));
			   resume.getResumeFiles().add(fileAttach);
			}
		}
		resumeService.save(resume);
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	/**
	 * 删除个人相片
	 */
	public String delphoto(){
		String strResumeId=getRequest().getParameter("resumeId");
		if(StringUtils.isNotEmpty(strResumeId)){
			resume=resumeService.get(new Long(strResumeId));
			resume.setPhoto("");
			resumeService.save(resume);
			setJsonString("{success:true}");
		}
		return SUCCESS;
	}
}
