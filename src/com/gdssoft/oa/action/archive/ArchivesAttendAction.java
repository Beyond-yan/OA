package com.gdssoft.oa.action.archive;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesAttend;
import com.gdssoft.oa.model.archive.ArchivesDoc;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.service.archive.ArchivesAttendService;
import com.gdssoft.oa.service.archive.ArchivesDocService;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;

/**
 * 
 * @author
 * 
 */
public class ArchivesAttendAction extends BaseAction {
	@Resource
	private ArchivesAttendService archivesAttendService;
	@Resource
	private ArchivesService archivesService;
	private ArchivesAttend archivesAttend;


//	@Resource
//	private RollFileService rollFileService;
	private Long attendId;

	private Archives archives;

	public Archives getArchives() {
		return archives;
	}

	@Resource
	private ArchivesDocService archivesDocService;
	
	public void setArchives(Archives archives) {
		this.archives = archives;
	}

	public Long getAttendId() {
		return attendId;
	}

	public void setAttendId(Long attendId) {
		this.attendId = attendId;
	}

	public ArchivesAttend getArchivesAttend() {
		return archivesAttend;
	}

	public void setArchivesAttend(ArchivesAttend archivesAttend) {
		this.archivesAttend = archivesAttend;
	}

	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());
		List<ArchivesAttend> list = archivesAttendService.getAll(filter);

		Type type = new TypeToken<List<ArchivesAttend>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");

		Gson gson = new Gson();
		buff.append(gson.toJson(list, type));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 批量删除
	 * 
	 * @return
	 */
	public String multiDel() {

		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				archivesAttendService.remove(new Long(id));
			}
		}

		jsonString = "{success:true}";

		return SUCCESS;
	}

	/**
	 * 显示详细信息
	 * 
	 * @return
	 */
	public String get() {
		ArchivesAttend archivesAttend = archivesAttendService.get(attendId);

		Gson gson = new Gson();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(archivesAttend));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS; 
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		String archivesStatus = getRequest().getParameter("archivesStatus");
		archives = archivesService.get(archives.getArchivesId());
		if (StringUtils.isNotEmpty(archivesStatus)) {
			archives.setStatus(Short.parseShort(archivesStatus));
		}
		/*if(Integer.valueOf(archivesStatus)==5){
			int archType = archives.getOdFlowtype().getIsAutoSave();
			if (archType == 1) {
				AppUser currentUser = ContextUtil.getCurrentUser();
				List<ArchivesDoc> arDocList = archivesDocService
						.findByAid(archives.getArchivesId());
				List<FileAttach> attachList = new ArrayList<FileAttach>();
				for (ArchivesDoc archivesDoc : arDocList) {
					attachList.add(archivesDoc.getFileAttach());
				}
				RollFile rollFile = new RollFile();
				rollFile.setFileName(archives.getSubject());
				rollFile.setTidyName(currentUser.getFullname());
				rollFile.setTidyTime(new Date());
				rollFileService.autoTidy(rollFile, attachList);
				archives.setStatus((short)7);
			}
		}*/
		archivesService.save(archives);

		archivesAttend.setArchives(archives);
		archivesAttend.setUserID(ContextUtil.getCurrentUserId());
		archivesAttend.setFullname(ContextUtil.getCurrentUser().getFullname());
		archivesAttend.setExecuteTime(new Date());
		archivesAttend.setAttendType("2");
		archivesAttendService.save(archivesAttend);
        
		setJsonString("{success:true,attendId:" + archivesAttend.getAttendId()
				+ "}");
		return SUCCESS;
	}

	/**
	 * 公文校对
	 * 
	 * @return
	 */
	public String proof() {
		String archivesId = getRequest().getParameter("archivesId");
		String status = getRequest().getParameter("status");
		Archives archives = archivesService.get(new Long(archivesId));
		archives.setStatus(Short.parseShort(status));

		archivesService.save(archives);

		archivesAttend.setArchives(archives);
		archivesAttend.setExecuteTime(new Date());
		archivesAttend.setUserID(ContextUtil.getCurrentUserId());
		archivesAttend.setFullname(ContextUtil.getCurrentUser().getFullname());
		archivesAttendService.save(archivesAttend);

		setJsonString("{success:true}");
		return SUCCESS;
	}
}
