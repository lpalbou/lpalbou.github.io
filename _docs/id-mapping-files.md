---
title: File formats for mapping IDs
permalink: /docs/file-formats-for-mapping/
---

# File formats for mapping IDs

This page documents the file formats used to store the mapping between the Database object IDs to corresponding sequence IDs in UniProtKB or NCBI.

* gp2protein file
* gp2rna file
* gp_unlocalized

## gp2protein file
A gp2protein file is a tab-delimited file that provides a mapping between database object IDs and protein sequence IDs. gp2protein files contributed by annotation groups are available for download.

Need for gp2protein file

    Used for downloading sequences from UniProtKB/NCBI. These sequences are used for AmiGO BLAST and for phylogenetic inferencing (PAINT)
    The sequence IDs (UniProtKB or NCBI) can be used in AmiGO to search for annotations
    The sequence IDs help with book keeping and tracking of IDs and annotations, removing duplicates etc.

Contents for the File

    Every group contributing an annotation file should contribute a gp2protein file, unless the annotation group directly annotates to UniProtKB accessions included in the UniProtKB Reference Proteome files.
    An annotation group's gp2protein file should be updated with each annotation file release.

Format

    The first column must contain all protein-encoding gene or protein identifiers available from the contributing annotation group; even those not annotated to GO in the accompanying annotation file.
    The second column should provide the mapping to corresponding sequence IDs. This should be to UniProtKB accessions. Ideally a single UniProtKBKB reviewed/Swiss-Prot accession should be mapped by a database object ID, if not then UniProtKB/TrEMBL accessions can be used. If no UniProtKB accession is available, an NCBI ID can be used (NP_ and XP_ allowed).
    Non-coding RNA (ncRNA) IDs should be provided in a separate gp2rna file.
    Entries with no sequence available, which might represent a classical mutant not yet associated with a genome sequence, should be listed in the gp_unlocalised file. 

## gp2protein file validation

    The UniProt-GOA group checks Consortium gp2protein files, supplying a monthly report of any deleted or secondary UniProtKB accessions included in a group's file with alternative valid UniProtKB accessions suggested when possible.
    All gp2protein files located in the gp2protein directory on the GO Consortium site are checked by UniProt-GOA and a report is emailed to the contact described in the email_report tag of the gene_association..conf file, located in the GO submission directory.
    If your group has any concerns regarding this report, please contact: goa@ebi.ac.uk
    In addition, the following UniProtKB files list all current secondary or deleted UniProtKB accessions: Secondary UniProtKB accessions
    Deleted UniProtKB/Swiss-Prot accessions
    Deleted UniProtKB/TrEMBL accessions

## gp2rna file
A gp2rna file is a tab-delimited file that provides mapping between the database object IDs and ncRNA gene/sequence IDs. Contribution of this file is a new requirement (starting June 2012). Need for gp2rna file

    This file will be used to download sequences of ncRNAs from NCBI, search in AmiGO and for book keeping/tracking of IDs and annotations, removing redundant annotations etc.
    This file is required from all GO groups who annotate to ncRNAs.
    If your annotation file includes ncRNAs, then the gp2rna file must include all ncRNA-encoding genes currently identified in the genome build including those ncRNAs not annotated to GO.
    Functional ncRNA must map to NCBI (NR_ or XR_) if available, blank if unavailable.
    This file should contain 2 columns, similar to the gp2protein file.
    The first column should be the ncRNA identifiers from the contributing annotation group and should include those that don't have GO annotations.
    The second column should provide mapping to the corresponding NCBI IDs. 

## gp_unlocalized
If your database supplies gene identifiers that have been manually curated from the literature, but where no sequence or genomic location is known (such genes have been variously described as 'unlocalised genes', 'single heritable traits' or 'phenotypic orphans'), then you should additionally supply a complete gp_unlocalized_file. This file should contain all the non-genome localized identifiers available in your database, including those not annotated to GO.
