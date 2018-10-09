package com.gdssoft.oa.action.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.archive.RepairRecArchive;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.archive.RepairRecArchiveService;
import com.google.gson.Gson;

import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class RepairRecArchiveAction extends BaseAction{
	@Resource
	private RepairRecArchiveService repairRecArchiveService;
	private RepairRecArchive repairRecArchive;
	
	private Long id;



	public RepairRecArchive getRepairRecArchive() {
		return repairRecArchive;
	}

	public void setRepairRecArchive(RepairRecArchive repairRecArchive) {
		this.repairRecArchive = repairRecArchive;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}


	/**
	 * 显示列表
	 */
	public String list(){
		QueryFilter filter=new QueryFilter(getRequest());
		
		filter.addSorted("status", "asc");
		List<RepairRecArchive> list= repairRecArchiveService.getAll(filter);

		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		JSONSerializer serializer = new JSONSerializer();
		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(list));
		buff.append("}");

		jsonString = buff.toString();
		
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
				repairRecArchiveService.remove(new Long(id));
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
		RepairRecArchive repairRecArchive=repairRecArchiveService.get(id);
		
		Gson gson=new Gson();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(repairRecArchive));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(repairRecArchive.getId()==null){
			repairRecArchiveService.save(repairRecArchive);
		}else{
			RepairRecArchive orgRepairRecArchive=repairRecArchiveService.get(repairRecArchive.getId());
			try{
				BeanUtil.copyNotNullProperties(orgRepairRecArchive,repairRecArchive);
				repairRecArchiveService.save(orgRepairRecArchive);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
}
